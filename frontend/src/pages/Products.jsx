import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllProductsWithPrice } from "../services/productService";
import Navbar from "../components/Navbar";

function Products() {
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [quantities, setQuantities] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  const buyerId = location.state?.buyerId;
  const buyerName = location.state?.buyerName || "";
  const gstRate = Number(location.state?.gstRate ?? 5);

  useEffect(() => {
    if (!buyerId) {
      navigate("/");
      return;
    }
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getAllProductsWithPrice(buyerId);
      setProducts(data);
      const initQty = {};
      data.forEach((p) => { initQty[p.productId] = 1; });
      setQuantities(initQty);
    } catch (err) {
      console.error(err);
    }
  };

  const changeQty = (productId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta),
    }));
  };

  const setQty = (productId, value) => {
    const nextValue = Number(value);
    setQuantities((prev) => ({
      ...prev,
      [productId]: Number.isFinite(nextValue) && nextValue >= 1 ? Math.floor(nextValue) : value === "" ? "" : 1,
    }));
  };

  const addProduct = (product) => {
    const qty = Number(quantities[product.productId]) || 1;
    setSelectedItems((prev) => ({
      ...prev,
      [product.productId]: {
        productId: product.productId,
        productName: product.productName,
        rate: product.rate,
        qty: (prev[product.productId]?.qty || 0) + qty,
        hasCustomPrice: product.hasCustomPrice,
      },
    }));
  };

  const removeItem = (productId) => {
    setSelectedItems((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const selectedList = Object.values(selectedItems);
  const subtotal = selectedList.reduce((sum, item) => sum + item.rate * item.qty, 0);
  const gst = subtotal * (gstRate / 100);
  const total = subtotal + gst;

  const proceedToCheckout = () => {
    if (selectedList.length === 0) {
      alert("Please add at least one product.");
      return;
    }
    navigate("/checkout", {
      state: { buyerId, buyerName, cart: selectedList, gstRate },
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-8 w-full flex-1">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          {buyerName && (
            <p className="text-slate-500 text-sm mt-1">
              Billing for:{" "}
              <span className="text-blue-700 font-semibold">{buyerName}</span>
            </p>
          )}
        </div>

        <div className="flex gap-6 items-start">

          {/* Product List */}
          <div className="flex-1 bg-white rounded-xl shadow border border-slate-100 overflow-hidden">

            <div className="grid grid-cols-12 text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3 bg-slate-50 border-b border-slate-100">
              <span className="col-span-5">Product</span>
              <span className="col-span-2 text-right">Rate</span>
              <span className="col-span-3 text-center">Quantity</span>
              <span className="col-span-2 text-center">Action</span>
            </div>

            {products.length === 0 ? (
              <p className="text-center text-slate-400 py-16 text-sm">Loading products...</p>
            ) : (
              products.map((product, index) => (
                <div
                  key={product.productId}
                  className={`grid grid-cols-12 items-center px-6 py-4 ${
                    index !== products.length - 1 ? "border-b border-slate-100" : ""
                  } ${
                    selectedItems[product.productId] ? "bg-blue-50/40" : "hover:bg-slate-50"
                  } transition-colors`}
                >
                  <div className="col-span-5">
                    <p className="font-medium text-slate-800">{product.productName}</p>
                    {product.hasCustomPrice && (
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded mt-1 inline-block">
                        Custom Price
                      </span>
                    )}
                  </div>

                  <div className="col-span-2 text-right">
                    <p className="font-semibold text-slate-800">₹ {product.rate}</p>
                  </div>

                  <div className="col-span-3 flex items-center justify-center gap-2">
                    <button
                      onClick={() => changeQty(product.productId, -1)}
                      className="w-8 h-8 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold transition-colors flex items-center justify-center text-lg leading-none"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantities[product.productId] ?? 1}
                      onChange={(e) => setQty(product.productId, e.target.value)}
                      className="w-14 h-8 text-center border border-slate-300 rounded-md text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => changeQty(product.productId, 1)}
                      className="w-8 h-8 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold transition-colors flex items-center justify-center text-lg leading-none"
                    >
                      +
                    </button>
                  </div>

                  <div className="col-span-2 flex justify-center">
                    <button
                      onClick={() => addProduct(product)}
                      className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary sidebar */}
          <div className="w-72 shrink-0">
            <div className="bg-white rounded-xl shadow border border-slate-100 p-5 sticky top-6">
              <h2 className="font-bold text-slate-900 mb-4">Order Summary</h2>

              {selectedList.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">
                  No items added yet
                </p>
              ) : (
                <div className="space-y-3 mb-4 max-h-72 overflow-y-auto">
                  {selectedList.map((item) => (
                    <div key={item.productId} className="flex items-start justify-between text-sm">
                      <div className="flex-1 pr-2">
                        <p className="text-slate-700 font-medium leading-tight text-xs">
                          {item.productName}
                        </p>
                        <p className="text-slate-400 text-xs mt-0.5">
                          ₹ {item.rate} × {item.qty}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <p className="text-slate-800 font-semibold text-xs">
                          ₹ {(item.rate * item.qty).toFixed(0)}
                        </p>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-red-400 hover:text-red-600 text-xs font-bold leading-none ml-1"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedList.length > 0 && (
                <div className="border-t border-slate-100 pt-3 mb-4 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Subtotal</span>
                    <span>₹ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>GST ({gstRate}%)</span>
                    <span>₹ {gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 text-sm pt-1.5 border-t border-slate-100">
                    <span>Total</span>
                    <span>₹ {total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={proceedToCheckout}
                disabled={selectedList.length === 0}
                className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Products;

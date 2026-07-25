import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllProductsWithPrice } from "../services/productService";
import Navbar from "../components/Navbar";

function Products() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  const buyerId = location.state?.buyerId;

  useEffect(() => {
    // If no buyer selected, send back to home
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
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities({ ...quantities, [productId]: value });
  };

  const addToCart = (product) => {
    const qty = parseInt(quantities[product.productId] || 1);

    if (isNaN(qty) || qty < 1) {
      alert("Please enter a valid quantity.");
      return;
    }

    // If product already in cart, just increase the quantity
    const existingIndex = cart.findIndex(
      (item) => item.productId === product.productId
    );

    if (existingIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].qty += qty;
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          productId: product.productId,
          productName: product.productName,
          rate: product.rate,
          qty,
        },
      ]);
    }

    // Reset qty input for this product after adding
    setQuantities({ ...quantities, [product.productId]: "" });
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    navigate("/checkout", {
      state: { buyerId, cart },
    });
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-10 w-full flex-1">

        {/* Page Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Select Products</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Prices shown are specific to the selected buyer. Custom prices take
              priority over default prices.
            </p>
          </div>

          <button
            onClick={proceedToCheckout}
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Cart ({totalCartItems}) → Checkout
          </button>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <p className="text-slate-500 text-center py-20">Loading products...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.productId}
                className="bg-white rounded-xl shadow p-6 border border-slate-100"
              >
                {/* Product name + badge */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-slate-800 text-lg leading-tight">
                    {product.productName}
                  </h3>
                  {product.hasCustomPrice && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium shrink-0 ml-2">
                      Custom
                    </span>
                  )}
                </div>

                {/* Price */}
                <p className="text-2xl font-bold text-blue-700 mb-5">
                  ₹ {product.rate}
                </p>

                {/* Qty input + Add to Cart */}
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={quantities[product.productId] || ""}
                    onChange={(e) =>
                      handleQuantityChange(product.productId, e.target.value)
                    }
                    className="w-20 border border-gray-300 rounded-lg p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-slate-900 hover:bg-slate-700 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Products;

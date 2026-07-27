import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const buyerId = location.state?.buyerId;
  const buyerName = location.state?.buyerName || "";
  const cart = location.state?.cart || [];

  const subtotal = cart.reduce((sum, item) => sum + item.rate * item.qty, 0);
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  const handleGenerateInvoice = () => {
    navigate("/invoice", {
      state: { buyerId, buyerName, cart },
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar />

      <div className="max-w-4xl mx-auto px-8 py-10 w-full flex-1">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
          <p className="text-slate-500 mt-1 text-sm">
            
            {buyerName && (
              <span> Billing for: <span className="text-blue-700 font-medium">{buyerName}</span></span>
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">

          {/* Cart Items — takes 2 cols */}
          <div className="md:col-span-2 bg-white rounded-xl shadow border border-slate-100">

            {/* Table Header */}
            <div className="grid grid-cols-4 text-sm font-semibold text-slate-500 uppercase tracking-wide px-6 py-4 border-b border-slate-100">
              <span className="col-span-2">Product</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Amount</span>
            </div>

            {/* Cart Rows */}
            {cart.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-4 items-center px-6 py-4 border-b border-slate-50 last:border-b-0"
              >
                <div className="col-span-2">
                  <p className="font-medium text-slate-800">{item.productName}</p>
                  <p className="text-sm text-slate-400">₹ {item.rate} per unit</p>
                </div>
                <p className="text-center text-slate-700">{item.qty}</p>
                <p className="text-right font-semibold text-slate-800">
                  ₹ {(item.rate * item.qty).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Order Summary — 1 col */}
          <div className="bg-white rounded-xl shadow border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹ {subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>GST (5%)</span>
                <span>₹ {gst.toFixed(2)}</span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-slate-900 text-base">
                <span>Total</span>
                <span>₹ {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleGenerateInvoice}
              className="w-full mt-6 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Preview Invoice →
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full mt-3 text-slate-500 hover:text-slate-700 text-sm transition-colors"
            >
              ← Back to Products
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;
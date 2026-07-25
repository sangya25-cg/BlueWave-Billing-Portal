import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBuyers } from "../services/buyerService";
import Navbar from "../components/Navbar";

function Home() {
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadBuyers();
  }, []);

  const loadBuyers = async () => {
    try {
      const data = await getAllBuyers();
      setBuyers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleContinue = () => {
    if (!selectedBuyer) {
      alert("Please select a buyer.");
      return;
    }

    navigate("/products", {
      state: {
        buyerId: selectedBuyer,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">

      <Navbar />

      <section className="max-w-7xl mx-auto px-8 py-16 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          <div>
            <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-3">
              Billing Portal
            </p>

            <h1 className="text-5xl font-bold text-slate-900 mb-4 leading-tight">
              BlueWave
            </h1>

            <h2 className="text-xl font-semibold text-blue-700 mb-5">
              Smart Billing for Sanitary Equipment
            </h2>

            <p className="text-slate-600 leading-relaxed mb-10">
              Manage customers, products, customer-specific pricing,
              GST calculations and invoice generation — all from one place.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow p-4 text-center border border-slate-100">
                <h3 className="text-2xl font-bold text-blue-700">
                  {buyers.length > 0 ? buyers.length : "—"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Buyers</p>
              </div>

              <div className="bg-white rounded-xl shadow p-4 text-center border border-slate-100">
                <h3 className="text-2xl font-bold text-blue-700">10+</h3>
                <p className="text-sm text-gray-500 mt-1">Products</p>
              </div>

              <div className="bg-white rounded-xl shadow p-4 text-center border border-slate-100">
                <h3 className="text-2xl font-bold text-blue-700">5%</h3>
                <p className="text-sm text-gray-500 mt-1">GST</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Start Billing</h2>
            <p className="text-slate-500 text-sm mb-6">
              Select a customer to begin generating an invoice.
            </p>

            <label className="block text-slate-700 font-medium mb-2">
              Select Customer
            </label>

            <select
              className="w-full border border-gray-300 rounded-lg p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedBuyer}
              onChange={(e) => setSelectedBuyer(e.target.value)}
            >
              <option value="">-- Select Buyer --</option>
              {buyers.map((buyer) => (
                <option key={buyer.id} value={buyer.id}>
                  {buyer.partyName}
                </option>
              ))}
            </select>

            <button
              onClick={handleContinue}
              className="w-full mt-6 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Continue →
            </button>
          </div>

        </div>
      </section>


      <section className="bg-white py-14 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-8">

          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">

            <div>
              <div className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Select Customer</h3>
              <p className="text-slate-500 text-sm">
                Choose the buyer you want to create the invoice for.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Add Products</h3>
              <p className="text-slate-500 text-sm">
                Browse products and add them to cart with the required quantity.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Generate Invoice</h3>
              <p className="text-slate-500 text-sm">
                Review your cart, confirm GST totals, and generate the invoice.
              </p>
            </div>

          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 text-center py-5 text-sm mt-auto">
        © 2026 BlueWave Billing. All rights reserved.
      </footer>

    </div>
  );
}

export default Home;
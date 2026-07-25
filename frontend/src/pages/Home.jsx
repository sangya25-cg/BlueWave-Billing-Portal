import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBuyers } from "../services/buyerService";
import logo from "../assets/bluewave-logo.png";

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
    <div className="min-h-screen bg-slate-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-slate-900 to-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {logo}

            <h1 className="text-2xl font-bold text-white">
              BlueWave
            </h1>
          </div>

          <div className="flex gap-8 text-white font-medium">
            <button className="hover:text-blue-300">
              Home
            </button>

            <button className="hover:text-blue-300">
              Add Buyer
            </button>

            <button className="hover:text-blue-300">
              Add Product
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <div>
            <h1 className="text-6xl font-bold text-slate-900 mb-4">
              BlueWave
            </h1>

            <h2 className="text-2xl font-semibold text-blue-700 mb-6">
              Smart Billing Solution for Sanitary Equipment
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed">
              Manage customers, products, customer-specific pricing,
              GST calculations and invoice generation from a
              single platform.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-10">
              <div className="bg-white rounded-xl shadow p-4 text-center">
                <h3 className="text-2xl font-bold text-blue-700">
                  6+
                </h3>
                <p className="text-sm text-gray-500">
                  Buyers
                </p>
              </div>

              <div className="bg-white rounded-xl shadow p-4 text-center">
                <h3 className="text-2xl font-bold text-blue-700">
                  10+
                </h3>
                <p className="text-sm text-gray-500">
                  Products
                </p>
              </div>

              <div className="bg-white rounded-xl shadow p-4 text-center">
                <h3 className="text-2xl font-bold text-blue-700">
                  5%
                </h3>
                <p className="text-sm text-gray-500">
                  GST Billing
                </p>
              </div>
            </div>
          </div>

          {/* Buyer Selection Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Start Billing
            </h2>

            <label className="block text-slate-700 font-medium mb-2">
              Select Customer
            </label>

            <select
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedBuyer}
              onChange={(e) => setSelectedBuyer(e.target.value)}
            >
              <option value="">
                -- Select Buyer --
              </option>

              {buyers.map((buyer) => (
                <option
                  key={buyer.id}
                  value={buyer.id}
                >
                  {buyer.partyName}
                </option>
              ))}
            </select>

            <button
              onClick={handleContinue}
              className="w-full mt-6 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
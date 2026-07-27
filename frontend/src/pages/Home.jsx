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

    const buyer = buyers.find((b) => String(b.id) === String(selectedBuyer));
    navigate("/products", {
      state: {
        buyerId: selectedBuyer,
        buyerName: buyer?.partyName || "",
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
    </div>
  );
}

export default Home;
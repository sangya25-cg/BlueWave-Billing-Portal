import { useNavigate } from "react-router-dom";
import logo from "../assets/bluewave-logo.png";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-blue-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div
          className="flex items-center justify-center sm:justify-start gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="BlueWave Logo" className="h-9 w-auto" />
          <h1 className="text-xl sm:text-2xl font-bold text-white">BlueWave</h1>
        </div>
        <div className="flex flex-wrap justify-center sm:justify-end gap-x-5 gap-y-2 text-sm sm:text-base text-white font-medium">
          <button
            onClick={() => navigate("/")}
            className="hover:text-blue-300 transition-colors"
          >
            Home
          </button>

          <button
            onClick={() => navigate("/add-buyer")}
            className="hover:text-blue-300 transition-colors"
          >
            Add Buyer
          </button>

          <button
            onClick={() => navigate("/add-product")}
            className="hover:text-blue-300 transition-colors"
          >
            Add Product
          </button>

          <button
            onClick={() => navigate("/invoices")}
            className="hover:text-blue-300 transition-colors"
          >
            Invoices
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

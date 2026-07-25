import { useNavigate } from "react-router-dom";
import logo from "../assets/bluewave-logo.png";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-blue-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

        {/* Logo + Brand — clicking takes you home */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="BlueWave Logo" className="h-9 w-auto" />
          <h1 className="text-2xl font-bold text-white">BlueWave</h1>
        </div>

        {/* Nav Links */}
        <div className="flex gap-8 text-white font-medium">
          <button
            onClick={() => navigate("/")}
            className="hover:text-blue-300 transition-colors"
          >
            Home
          </button>

          <button className="hover:text-blue-300 transition-colors">
            Add Buyer
          </button>

          <button className="hover:text-blue-300 transition-colors">
            Add Product
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;

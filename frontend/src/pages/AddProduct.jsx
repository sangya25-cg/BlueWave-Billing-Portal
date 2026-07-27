import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { createProduct } from "../services/productService";
import { getAllCategories } from "../services/categoryService";

function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    categoryId: "",
    modelName: "",
    defaultPrice: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch {
        setCategories([]);
      }
    };
    load();
  }, []);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryId || !form.modelName.trim() || !form.defaultPrice) {
      setMessage("Category, model name and default price are required.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      await createProduct({
        categoryId: Number(form.categoryId),
        modelName: form.modelName.trim(),
        defaultPrice: Number(form.defaultPrice),
      });

      setForm({ categoryId: "", modelName: "", defaultPrice: "" });
      setMessage("Product added successfully.");
    } catch {
      setMessage("Failed to add product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="bg-white rounded-xl border border-slate-200 shadow p-5 sm:p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Add Product</h1>
          <p className="text-sm text-slate-500 mb-6">Simple product creation form.</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <select
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
              value={form.categoryId}
              onChange={(e) => onChange("categoryId", e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
              placeholder="Model Name"
              value={form.modelName}
              onChange={(e) => onChange("modelName", e.target.value)}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
              placeholder="Default Price"
              value={form.defaultPrice}
              onChange={(e) => onChange("defaultPrice", e.target.value)}
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg"
            >
              {saving ? "Saving..." : "Add Product"}
            </button>
          </form>

          {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default AddProduct;

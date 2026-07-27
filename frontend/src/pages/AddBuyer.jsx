import { useState } from "react";
import Navbar from "../components/Navbar";
import { createBuyer } from "../services/buyerService";

function AddBuyer() {
  const [form, setForm] = useState({
    partyName: "",
    gstin: "",
    mobile: "",
    email: "",
    billingAddress: "",
    state: "",
    city: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.partyName.trim()) {
      setMessage("Party name is required.");
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");
    setMessageType("");
    try {
      await createBuyer({
        partyName: form.partyName.trim(),
        gstin: form.gstin.trim() || null,
        mobile: form.mobile.trim() || null,
        email: form.email.trim() || null,
        billingAddress: form.billingAddress.trim() || null,
        state: form.state.trim() || null,
        city: form.city.trim() || null,
      });

      setForm({
        partyName: "",
        gstin: "",
        mobile: "",
        email: "",
        billingAddress: "",
        state: "",
        city: "",
      });
      setMessage("Buyer added successfully.");
      setMessageType("success");
    } catch {
      setMessage("Failed to add buyer.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl border border-slate-200 shadow p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Add Buyer</h1>
          <p className="text-sm text-slate-500 mb-6">Simple buyer creation form.</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <input
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
              placeholder="Party Name *"
              value={form.partyName}
              onChange={(e) => onChange("partyName", e.target.value)}
            />
            <input
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
              placeholder="GSTIN"
              value={form.gstin}
              onChange={(e) => onChange("gstin", e.target.value)}
            />
            <input
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
              placeholder="Mobile"
              value={form.mobile}
              onChange={(e) => onChange("mobile", e.target.value)}
            />
            <input
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
              placeholder="Email"
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
            />
            <input
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
              placeholder="Billing Address"
              value={form.billingAddress}
              onChange={(e) => onChange("billingAddress", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                placeholder="State"
                value={form.state}
                onChange={(e) => onChange("state", e.target.value)}
              />
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                placeholder="City"
                value={form.city}
                onChange={(e) => onChange("city", e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg"
            >
              {saving ? "Saving..." : "Add Buyer"}
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 text-sm ${
                messageType === "success" ? "text-green-700" : "text-red-700"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddBuyer;

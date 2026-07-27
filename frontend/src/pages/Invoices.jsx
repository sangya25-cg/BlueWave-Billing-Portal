import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllInvoices } from "../services/invoiceService";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const data = await getAllInvoices();
        setInvoices(data);
      } catch {
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h1 className="text-xl font-semibold text-slate-900 mb-4">Saved Invoices</h1>

          {loading ? (
            <p className="text-sm text-slate-500">Loading invoices...</p>
          ) : invoices.length === 0 ? (
            <p className="text-sm text-slate-500">No saved invoices found.</p>
          ) : (
            <>
              <div className="space-y-3 sm:hidden">
                {invoices.map((invoice) => (
                  <div key={invoice.invoiceId} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <p className="text-sm font-semibold text-slate-900">{invoice.invoiceNo}</p>
                    <p className="text-sm text-slate-700 mt-1">{invoice.buyerName}</p>
                    <p className="text-xs text-slate-500 mt-1">{new Date(invoice.invoiceDate).toLocaleDateString("en-IN")}</p>
                    <div className="flex justify-between items-center mt-3 text-sm">
                      <span className="text-slate-600">₹ {Number(invoice.totalAmount).toFixed(2)}</span>
                      <span className="text-slate-700">{invoice.status || "NA"}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="py-2 pr-4 font-medium text-slate-600">Invoice No</th>
                    <th className="py-2 pr-4 font-medium text-slate-600">Buyer</th>
                    <th className="py-2 pr-4 font-medium text-slate-600">Date</th>
                    <th className="py-2 pr-4 font-medium text-slate-600">Total</th>
                    <th className="py-2 font-medium text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.invoiceId} className="border-b border-slate-100">
                      <td className="py-2 pr-4 text-slate-800">{invoice.invoiceNo}</td>
                      <td className="py-2 pr-4 text-slate-800">{invoice.buyerName}</td>
                      <td className="py-2 pr-4 text-slate-800">
                        {new Date(invoice.invoiceDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-2 pr-4 text-slate-800">₹ {Number(invoice.totalAmount).toFixed(2)}</td>
                      <td className="py-2 text-slate-800">{invoice.status || "NA"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Invoices;

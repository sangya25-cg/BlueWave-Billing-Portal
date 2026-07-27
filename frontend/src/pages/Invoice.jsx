import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createInvoice } from "../services/invoiceService";
import { getAllBuyers } from "../services/buyerService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import signature from "../assets/signature.png";
import logo from "../assets/bluewave-logo.png";

function Invoice() {
  const location = useLocation();
  const navigate = useNavigate();
  const invoiceRef = useRef();

  const buyerId = location.state?.buyerId;
  const buyerName = location.state?.buyerName || "N/A";
  const cart = location.state?.cart || [];
  const [buyerInfo, setBuyerInfo] = useState(null);

  const [savedInvoice, setSavedInvoice] = useState(null);
  const [saving, setSaving] = useState(false);
  const [hideSignature, setHideSignature] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.rate * item.qty, 0);
  const gstRate = 0.05;
  const gst = subtotal * gstRate;
  const cgst = gst / 2;
  const sgst = gst / 2;
  const total = subtotal + gst;

  useEffect(() => {
    const loadBuyer = async () => {
      try {
        const buyers = await getAllBuyers();
        const selected = buyers.find((b) => String(b.id) === String(buyerId));
        setBuyerInfo(selected || null);
      } catch {
        setBuyerInfo(null);
      }
    };

    if (buyerId) {
      loadBuyer();
    }
  }, [buyerId]);

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handleSave = async () => {
    if (savedInvoice || saving) return;
    setSaving(true);
    try {
      const invoicePayload = {
        buyerId,
        items: cart.map((item) => ({
          productId: item.productId,
          qty: item.qty,
        })),
      };
      const response = await createInvoice(invoicePayload);
      setSavedInvoice(response);
    } catch (err) {
      console.error(err);
      alert("Failed to save bill. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePrintNoSignature = () => {
    setHideSignature(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setHideSignature(false), 1000);
    }, 150);
  };

  const handleDownloadWithSignature = async () => {
    if (!invoiceRef.current) {
      alert("Failed to download. Please try again.");
      return;
    }

    setHideSignature(false);
    await new Promise((r) => setTimeout(r, 150));
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        imgWidth,
        Math.min(imgHeight, pageHeight)
      );
      const safeBuyerName = String(buyerName).replace(/[^a-zA-Z0-9-_ ]/g, "").trim() || "Buyer";
      const filename = `Invoice_${savedInvoice?.invoiceNo || "Draft"}_${safeBuyerName}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error(err);
      alert("Failed to download. Please try again.");
    }
  };

  if (!cart.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <p className="text-slate-500 mb-4">No invoice data found.</p>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 underline"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #invoice-print-area,
          #invoice-print-area * { visibility: visible !important; }
          #invoice-print-area {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            padding: 20px !important;
            box-shadow: none !important;
            border: 1px solid #000 !important;
            border-radius: 0 !important;
            background: #fff !important;
          }
          .no-print { display: none !important; }
          ${hideSignature ? ".signature-section { display: none !important; }" : ""}
        }
      `}</style>

      <div className="no-print max-w-3xl mx-auto px-6 pt-6 pb-4 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1"
        >
          ← Back to Checkout
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving || !!savedInvoice}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          >
            {saving ? "Saving..." : savedInvoice ? "Saved" : "Save Bill"}
          </button>

          <button
            onClick={handlePrintNoSignature}
            className="bg-slate-700 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          >
            Print Bill
          </button>

          <button
            onClick={handleDownloadWithSignature}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          >
            Download Bill
          </button>
        </div>
      </div>

      {savedInvoice && (
        <div className="no-print max-w-3xl mx-auto px-6 pb-2">
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-sm text-green-800 flex items-center gap-2">
            <span className="font-semibold">Bill saved.</span>
            <span>Invoice No: <strong>{savedInvoice.invoiceNo}</strong></span>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 pb-10">
        <div
          id="invoice-print-area"
          ref={invoiceRef}
          className="bg-white shadow border border-black p-4 text-[10px] leading-tight"
        >
          <div className="border border-black">
            <div className="grid grid-cols-12 border-b border-black">
              <div className="col-span-3 border-r border-black p-2 text-[9px]">
                <img src={logo} alt="BlueWave Logo" className="h-8 w-auto" />
                <p className="mt-1">Sanitary Equipment Supplier</p>
                <p>GSTIN: 27AABCU0000A1Z5</p>
                <p>Pune, Maharashtra</p>
                <p>+91-9000000000</p>
              </div>
              <div className="col-span-6 border-r border-black p-2 text-center">
                <p className="text-[10px] tracking-wide">TAX INVOICE</p>
                <p className="font-bold text-[20px] text-blue-700 mt-1 leading-none">BLUEWAVE</p>
                <p className="mt-1 text-[9px]">BATHROOM FITTINGS | SHOWERS | BASINS | DRAIN COVERS</p>
                <p className="text-[9px]">A-11, Industrial Estate, Pune - 411001, Maharashtra</p>
              </div>
              <div className="col-span-3 p-2 text-[9px]">
                <p><span className="font-semibold">Mob:</span> +91-9000000000</p>
                <p><span className="font-semibold">State:</span> Maharashtra</p>
                <p><span className="font-semibold">State Code:</span> 27</p>
              </div>
            </div>

            <div className="grid grid-cols-12 border-b border-black text-[9px]">
              <div className="col-span-5 border-r border-black p-1.5">
                <span className="font-semibold">GSTIN:</span> {buyerInfo?.gstin || "NA"}
              </div>
              <div className="col-span-4 border-r border-black p-1.5">
                <span className="font-semibold">HSN/SAC:</span> 8481 / 3925
              </div>
              <div className="col-span-3 p-1.5">
                <span className="font-semibold">Original / Duplicate</span>
              </div>
            </div>

            <div className="grid grid-cols-12 border-b border-black text-[9px] min-h-20">
              <div className="col-span-7 border-r border-black p-1.5">
                <p className="font-semibold">Details of Receiver / Billed To</p>
                <p className="mt-1"><span className="font-semibold">Name:</span> {buyerName}</p>
                <p><span className="font-semibold">Address:</span> {buyerInfo?.billingAddress || "NA"}</p>
                <p><span className="font-semibold">City:</span> {buyerInfo?.city || "NA"} <span className="font-semibold ml-2">State:</span> {buyerInfo?.state || "NA"}</p>
                <p><span className="font-semibold">Mobile:</span> {buyerInfo?.mobile || "NA"}</p>
              </div>
              <div className="col-span-5 p-1.5">
                <p><span className="font-semibold">Invoice No:</span> {savedInvoice?.invoiceNo || "Draft"}</p>
                <p><span className="font-semibold">Date:</span> {today}</p>
                <p><span className="font-semibold">Place of Supply:</span> {buyerInfo?.state || "Maharashtra"}</p>
                <p><span className="font-semibold">Payment Type:</span> Cash/Credit</p>
              </div>
            </div>

            <table className="w-full border-b border-black text-[9px]">
              <thead>
                <tr>
                  <th className="border-r border-black border-b border-black p-1 text-left w-[6%]">No.</th>
                  <th className="border-r border-black border-b border-black p-1 text-left w-[30%]">Name of Product / HSN</th>
                  <th className="border-r border-black border-b border-black p-1 text-center w-[8%]">GST %</th>
                  <th className="border-r border-black border-b border-black p-1 text-center w-[8%]">Qty</th>
                  <th className="border-r border-black border-b border-black p-1 text-right w-[10%]">Rate</th>
                  <th className="border-r border-black border-b border-black p-1 text-right w-[12%]">Taxable Value</th>
                  <th className="border-r border-black border-b border-black p-1 text-right w-[10%]">CGST</th>
                  <th className="border-r border-black border-b border-black p-1 text-right w-[10%]">SGST</th>
                  <th className="border-b border-black p-1 text-right w-[12%]">Amount</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => {
                  const amount = item.rate * item.qty;
                  const itemCgst = amount * (gstRate / 2);
                  const itemSgst = amount * (gstRate / 2);
                  const lineTotal = amount + itemCgst + itemSgst;

                  return (
                    <tr key={`${item.productId}-${index}`}>
                      <td className="border-r border-black p-1 align-top">{index + 1}</td>
                      <td className="border-r border-black p-1 align-top">{item.productName}<br />HSN: 8481</td>
                      <td className="border-r border-black p-1 text-center align-top">5%</td>
                      <td className="border-r border-black p-1 text-center align-top">{item.qty}</td>
                      <td className="border-r border-black p-1 text-right align-top">{Number(item.rate).toFixed(2)}</td>
                      <td className="border-r border-black p-1 text-right align-top">{amount.toFixed(2)}</td>
                      <td className="border-r border-black p-1 text-right align-top">{itemCgst.toFixed(2)}</td>
                      <td className="border-r border-black p-1 text-right align-top">{itemSgst.toFixed(2)}</td>
                      <td className="p-1 text-right align-top">{lineTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
                {Array.from({ length: Math.max(0, 8 - cart.length) }).map((_, idx) => (
                  <tr key={`empty-${idx}`}>
                    <td className="border-r border-black p-2">&nbsp;</td>
                    <td className="border-r border-black p-2">&nbsp;</td>
                    <td className="border-r border-black p-2">&nbsp;</td>
                    <td className="border-r border-black p-2">&nbsp;</td>
                    <td className="border-r border-black p-2">&nbsp;</td>
                    <td className="border-r border-black p-2">&nbsp;</td>
                    <td className="border-r border-black p-2">&nbsp;</td>
                    <td className="border-r border-black p-2">&nbsp;</td>
                    <td className="p-2">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="grid grid-cols-12 min-h-32">
              <div className="col-span-8 border-r border-black p-1.5 text-[9px]">
                <p className="font-semibold">Bank Details</p>
                <p>Name: BLUEWAVE</p>
                <p>A/C No: 0000123456789</p>
                <p>IFSC: HDFC0001234</p>
                <p>Branch: Pune Main</p>
                <p className="mt-2 font-semibold">Terms & Conditions</p>
                <p>1. Goods once sold will not be taken back.</p>
                <p>2. Interest @18% p.a. will be charged on overdue bills.</p>
                <p>3. Subject to Pune jurisdiction.</p>
              </div>
              <div className="col-span-4 text-[9px]">
                <table className="w-full h-full">
                  <tbody>
                    <tr>
                      <td className="border-b border-black p-1.5 font-semibold">Total Taxable Value</td>
                      <td className="border-b border-black p-1.5 text-right">{subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="border-b border-black p-1.5">ADD CGST</td>
                      <td className="border-b border-black p-1.5 text-right">{cgst.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="border-b border-black p-1.5">ADD SGST</td>
                      <td className="border-b border-black p-1.5 text-right">{sgst.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="border-b border-black p-1.5 font-semibold">Total Amount</td>
                      <td className="border-b border-black p-1.5 text-right font-semibold">{total.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="border-b border-black p-1.5">Any Other Charges</td>
                      <td className="border-b border-black p-1.5 text-right">0.00</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 font-bold">TOTAL INVOICE</td>
                      <td className="p-1.5 text-right font-bold">{total.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-12 border-t border-black min-h-20 items-end">
              <div className="col-span-8 p-1.5 text-[9px]">
                <p>Customer Seal</p>
              </div>
              <div className="col-span-4 p-1.5 text-center signature-section">
                {!hideSignature && (
                  <img
                    src={signature}
                    alt="Authorized signature"
                    className="w-36 h-12 object-contain mx-auto"
                  />
                )}
                <p className="font-semibold mt-1">Authorized Signatory</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invoice;
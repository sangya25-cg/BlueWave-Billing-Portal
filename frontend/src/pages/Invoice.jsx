import { useLocation } from "react-router-dom";

function Invoice() {
  const location = useLocation();

  const invoice = location.state?.invoice;

  if (!invoice) {
    return <h2>No Invoice Found</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Invoice Generated Successfully</h1>

      <h3>Invoice No: {invoice.invoiceNo}</h3>

      <p>Invoice Id: {invoice.invoiceId}</p>

      <p>Subtotal: ₹ {invoice.subtotal}</p>

      <p>GST: ₹ {invoice.gstAmount}</p>

      <h2>Total: ₹ {invoice.totalAmount}</h2>
    </div>
  );
}

export default Invoice;
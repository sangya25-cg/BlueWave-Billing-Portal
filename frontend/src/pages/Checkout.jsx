import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { createInvoice } from "../services/invoiceService";
function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const buyerId = location.state?.buyerId;
  const cart = location.state?.cart || [];

  const subtotal = cart.reduce(
    (sum, item) => sum + item.rate * item.qty,
    0
  );

  const gst = subtotal * 0.05;

  const total = subtotal + gst;
  const handleGenerateInvoice = async () => {
  try {
    const invoicePayload = {
      buyerId,
      items: cart.map((item) => ({
        productId: item.productId,
        qty: item.qty,
      })),
    };

    const response = await createInvoice(invoicePayload);

    navigate("/invoice", {
      state: {
        invoice: response,
      },
    });
  } catch (error) {
    console.error(error);
    alert("Failed to generate invoice.");
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>Checkout</h1>

      <p>Buyer Id: {buyerId}</p>

      <hr />

      {cart.map((item, index) => (
        <div key={index}>
          <h3>{item.productName}</h3>

          <p>Rate: ₹ {item.rate}</p>

          <p>Qty: {item.qty}</p>

          <p>Amount: ₹ {item.rate * item.qty}</p>

          <hr />
        </div>
      ))}

      <h3>Subtotal: ₹ {subtotal}</h3>

      <h3>GST (5%): ₹ {gst}</h3>

      <h2>Total: ₹ {total}</h2>
      <br />

<button onClick={handleGenerateInvoice}>
  Generate Invoice
</button>
    </div>
  );
}

export default Checkout;
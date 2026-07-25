import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProductsByBuyer } from "../services/productService";

function Products() {
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});

  const location = useLocation();

  const buyerId = location.state?.buyerId;

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProductsByBuyer(buyerId);

      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities({
      ...quantities,
      [productId]: value,
    });
  };

  const addToCart = (product) => {
    const qty = parseInt(quantities[product.productId] || 1);

    const item = {
      productId: product.productId,
      productName: product.productName,
      rate: product.rate,
      qty,
    };

    setCart((prev) => [...prev, item]);

    alert(`${product.productName} added to cart`);
  };
  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    navigate("/checkout", {
      state: {
        buyerId,
        cart,
      },
    });
  };
  return (
    <div style={{ padding: "20px" }}>
      <h1>Select Products</h1>

      <p>Cart Items: {cart.length}</p>

      <button onClick={proceedToCheckout}>Proceed To Checkout</button>

      <br />
      <br />

      {products.map((product) => (
        <div
          key={product.productId}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "10px",
          }}
        >
          <h3>{product.productName}</h3>

          <p>Rate: ₹ {product.rate}</p>

          <input
            type="number"
            min="1"
            placeholder="Quantity"
            value={quantities[product.productId] || ""}
            onChange={(e) =>
              handleQuantityChange(product.productId, e.target.value)
            }
          />

          <br />
          <br />

          <button onClick={() => addToCart(product)}>Add To Cart</button>
        </div>
      ))}
    </div>
  );
}

export default Products;

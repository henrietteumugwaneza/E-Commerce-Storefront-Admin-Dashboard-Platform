import { useCart } from "../../hooks/useCart";

const Cart = () => {
  const { cart } = useCart();

  return (
    <div>
      {cart.map((item, i) => (
        <p key={i}>{item.title}</p>
      ))}
    </div>
  );
};

export default Cart;
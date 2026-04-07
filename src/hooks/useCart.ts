import { useEffect, useState } from "react";

export const useCart = () => {
  const [cart, setCart] = useState<any[]>(
    JSON.parse(localStorage.getItem("cart") || "[]")
  );

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any) => {
    setCart([...cart, product]);
  };

  return { cart, addToCart };
};
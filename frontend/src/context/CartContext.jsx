import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.cantidad + quantity);
        return prev.map((item) =>
          item.id === product.id ? { ...item, cantidad: newQty } : item
        );
      }
      return [...prev, { ...product, cantidad: Math.min(product.stock, quantity) }];
    });
  };

  const updateQuantity = (productId, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, cantidad: Math.min(item.stock, cantidad) }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Cálculo estimado en cliente (incluye simulación de descuento RN-03 >= 5 unidades por categoría)
  const subtotal = cart.reduce((acc, item) => acc + parseFloat(item.precio) * item.cantidad, 0);

  const categoryMap = {};
  cart.forEach((item) => {
    if (!categoryMap[item.category_id]) categoryMap[item.category_id] = { qty: 0, amount: 0 };
    categoryMap[item.category_id].qty += item.cantidad;
    categoryMap[item.category_id].amount += parseFloat(item.precio) * item.cantidad;
  });

  let estimatedDiscount = 0;
  Object.values(categoryMap).forEach((cat) => {
    if (cat.qty >= 5) {
      estimatedDiscount += cat.amount * 0.10;
    }
  });

  const total = Math.max(0, subtotal - estimatedDiscount);
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        estimatedDiscount,
        total,
        totalItems,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
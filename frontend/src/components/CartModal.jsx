import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartModal() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    estimatedDiscount,
    total
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
        <div className="p-5 border-b flex items-center justify-between bg-indigo-950 text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold">Tu Carrito de Compras</h2>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="p-1 hover:bg-indigo-900 rounded">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <p className="text-center text-slate-500 mt-16">Tu carrito está vacío.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-3 border-b pb-4">
                <img
                  src={item.imagen_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=150&q=80'}
                  alt={item.nombre}
                  className="w-16 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-slate-800">{item.nombre}</h4>
                  <p className="text-xs text-slate-500">${parseFloat(item.precio).toFixed(2)} c/u</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                      className="p-1 border rounded hover:bg-slate-100"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.cantidad}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                      disabled={item.cantidad >= item.stock}
                      className="p-1 border rounded hover:bg-slate-100 disabled:opacity-40"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-end">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-sm">
                    ${(parseFloat(item.precio) * item.cantidad).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t bg-slate-50 space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {estimatedDiscount > 0 && (
              <div className="flex justify-between text-sm text-emerald-600 font-medium">
                <span>Descuento mayorista (RN-03):</span>
                <span>-${estimatedDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t">
              <span>Total estimado:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Continuar al Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
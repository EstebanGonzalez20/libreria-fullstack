import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/app';

export default function Checkout() {
  const { cart, subtotal, estimatedDiscount, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  if (!user) {
    return (
      <div className="max-w-lg mx-auto my-16 bg-white p-8 rounded-xl shadow text-center">
        <h2 className="text-xl font-bold mb-2">Inicia sesión para completar tu compra</h2>
        <p className="text-slate-500 text-sm mb-6">Necesitas una cuenta de cliente para registrar tu orden.</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold"
        >
          Ir al Login
        </button>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto my-16 bg-white p-8 rounded-2xl shadow-md text-center space-y-4">
        <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
        <h2 className="text-2xl font-extrabold text-slate-900">¡Compra Realizada con Éxito!</h2>
        <p className="text-slate-600">Orden #{orderSuccess.id} registrada y stock actualizado.</p>
        <div className="bg-slate-50 p-4 rounded-lg text-left text-sm space-y-1">
          <p><strong>Subtotal:</strong> ${parseFloat(orderSuccess.subtotal).toFixed(2)}</p>
          <p><strong>Descuento aplicado:</strong> -${parseFloat(orderSuccess.descuento_aplicado).toFixed(2)}</p>
          <p className="text-base font-bold text-indigo-950">Total Pagado: ${parseFloat(orderSuccess.total).toFixed(2)}</p>
        </div>
        <button
          onClick={() => navigate('/orders')}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700"
        >
          Ver Mis Órdenes
        </button>
      </div>
    );
  }

  const handleConfirmOrder = async () => {
    setError('');
    setLoading(true);
    try {
      const payload = {
        items: cart.map((item) => ({
          product_id: item.id,
          cantidad: item.cantidad
        }))
      };
      const { data } = await api.post('/orders', payload);
      setOrderSuccess(data.order);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar la compra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {cart.length === 0 ? (
        <p className="text-slate-500">No hay productos en tu carrito.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
          <div className="divide-y">
            {cart.map((item) => (
              <div key={item.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.nombre}</p>
                  <p className="text-xs text-slate-500">Cantidad: {item.cantidad} × ${parseFloat(item.precio).toFixed(2)}</p>
                </div>
                <span className="font-bold">${(item.cantidad * parseFloat(item.precio)).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Descuento Mayorista (5+ u. misma categoría):</span>
              <span>-${estimatedDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-extrabold pt-2 border-t">
              <span>Total a Pagar:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            disabled={loading}
            onClick={handleConfirmOrder}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Procesando transacción...' : 'Confirmar y Pagar Orden'}
          </button>
        </div>
      )}
    </div>
  );
}
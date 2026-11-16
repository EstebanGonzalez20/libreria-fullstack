import { useEffect, useState } from 'react';
import api from '../services/app';
import { useAuth } from '../context/AuthContext';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const { isAdmin } = useAuth();

  const fetchOrders = () => {
    api.get('/orders').then((res) => setOrders(res.data));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { estado: newStatus });
      fetchOrders();
    } catch (error) {
      alert('Error al cambiar estado de orden');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">
        {isAdmin ? 'Historial Global de Ventas' : 'Mis Órdenes de Compra'}
      </h1>

      {orders.length === 0 ? (
        <p className="text-slate-500">No hay órdenes registradas.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border rounded-xl p-5 shadow-sm">
              <div className="flex flex-wrap justify-between items-center border-b pb-3 gap-2">
                <div>
                  <span className="font-bold text-lg">Orden #{order.id}</span>
                  <p className="text-xs text-slate-500">
                    Fecha: {new Date(order.fecha).toLocaleString()}
                    {isAdmin && order.user && ` • Cliente: ${order.user.nombre} (${order.user.email})`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {isAdmin ? (
                    <select
                      value={order.estado}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border rounded px-2.5 py-1 text-xs font-bold bg-slate-50"
                    >
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="PAGADO">PAGADO</option>
                      <option value="COMPLETADO">COMPLETADO</option>
                      <option value="CANCELADO">CANCELADO</option>
                    </select>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                      {order.estado}
                    </span>
                  )}
                  <span className="text-lg font-extrabold text-slate-900">
                    ${parseFloat(order.total).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-sm">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-slate-700">
                    <span>{item.cantidad}x {item.product?.nombre}</span>
                    <span>${(item.cantidad * parseFloat(item.precio_unitario)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Barcode } from 'lucide-react';
import api from '../services/app';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <div className="text-center py-20">Cargando detalle...</div>;

  const handleAdd = () => {
    addToCart(product, qty);
    setIsCartOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link to="/catalog" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> Volver al catálogo
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={product.imagen_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80'}
          alt={product.nombre}
          className="w-full h-96 object-cover rounded-xl"
        />

        <div className="flex flex-col justify-between space-y-6">
          <div>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
              {product.category?.nombre}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-3">{product.nombre}</h1>
            <p className="text-lg text-slate-600 mt-1">por <strong>{product.autor || 'Autor no especificado'}</strong></p>

            <div className="mt-4 space-y-1 text-sm text-slate-500">
              <p className="flex items-center gap-2"><Barcode className="h-4 w-4" /> ISBN / Código: {product.codigo_barras}</p>
              {product.epoca && <p>Época: {product.epoca}</p>}
              {product.tipo && <p>Formato: {product.tipo}</p>}
            </div>

            <div className="mt-6">
              <span className="text-3xl font-black text-indigo-950">${parseFloat(product.precio).toFixed(2)}</span>
              <p className={`text-sm mt-1 font-medium ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `Disponible (${product.stock} en stock)` : 'Sin stock disponible'}
              </p>
            </div>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-4 pt-4 border-t">
              <input
                type="number"
                min={1}
                max={product.stock}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                className="w-20 border rounded-lg py-2.5 px-3 text-center font-bold"
              />
              <button
                onClick={handleAdd}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <ShoppingCart className="h-5 w-5" /> Agregar al Carrito
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
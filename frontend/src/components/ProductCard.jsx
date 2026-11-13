import { Link } from 'react-router-dom';
import { ShoppingCart, AlertTriangle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const outOfStock = product.stock <= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition">
      <Link to={`/products/${product.id}`} className="relative h-56 bg-slate-100 overflow-hidden">
        <img
          src={product.imagen_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80'}
          alt={product.nombre}
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
        />
        {product.category && (
          <span className="absolute top-2 left-2 bg-indigo-900/90 text-white text-xs px-2.5 py-1 rounded-full">
            {product.category.nombre}
          </span>
        )}
        {product.alerta_bajo_stock && !outOfStock && (
          <span className="absolute bottom-2 right-2 bg-amber-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> ¡Últimas {product.stock} u.!
          </span>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/products/${product.id}`}>
            <h3 className="font-bold text-lg text-slate-800 hover:text-indigo-700 line-clamp-1">
              {product.nombre}
            </h3>
          </Link>
          <p className="text-sm text-slate-500 mt-0.5">{product.autor || 'Autor desconocido'}</p>
          <div className="flex gap-2 mt-2 text-xs text-slate-400">
            {product.epoca && <span>• {product.epoca}</span>}
            {product.tipo && <span>• {product.tipo}</span>}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xl font-extrabold text-indigo-950">${parseFloat(product.precio).toFixed(2)}</span>
            <p className="text-xs text-slate-400">Stock: {product.stock}</p>
          </div>

          <button
            disabled={outOfStock}
            onClick={() => addToCart(product, 1)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition ${
              outOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            {outOfStock ? 'Agotado' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}
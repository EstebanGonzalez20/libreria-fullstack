import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookMarked, Truck, Percent } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/products?limit=4')
      .then((res) => setFeatured(res.data.products || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl space-y-6">
            <span className="bg-amber-400/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Catálogo Actualizado en Tiempo Real
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Tu próxima gran historia comienza en <span className="text-amber-400">LibreríaPro</span>
            </h1>
            <p className="text-indigo-200 text-lg">
              Explora literatura clásica, ciencia ficción, ensayos históricos y textos técnicos con control de disponibilidad instantáneo.
            </p>
            <div className="flex gap-4">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-lg hover:bg-amber-300 transition"
              >
                Explorar Catálogo <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 w-full md:w-96">
            <div className="bg-white/10 backdrop-blur p-4 rounded-xl flex items-start gap-3">
              <Percent className="h-6 w-6 text-amber-400 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold">Descuento Mayorista Automático</h3>
                <p className="text-xs text-indigo-200">Lleva 5 o más libros de la misma categoría y obtén 10% OFF directo.</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur p-4 rounded-xl flex items-start gap-3">
              <BookMarked className="h-6 w-6 text-amber-400 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold">Stock Garantizado</h3>
                <p className="text-xs text-indigo-200">Inventario sincronizado transaccionalmente en cada compra.</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur p-4 rounded-xl flex items-start gap-3">
              <Truck className="h-6 w-6 text-amber-400 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold">Seguimiento de Órdenes</h3>
                <p className="text-xs text-indigo-200">Consulta el historial y estado de tus pedidos en todo momento.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destacados */}
      <section className="max-w-7xl mx-auto px-4 mt-14">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Novedades Destacadas</h2>
          <Link to="/catalog" className="text-indigo-600 font-semibold hover:underline text-sm">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>
    </div>
  );
}
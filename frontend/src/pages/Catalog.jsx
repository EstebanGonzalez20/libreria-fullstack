import { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import api from '../services/app';
import ProductCard from '../components/ProductCard';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [epoca, setEpoca] = useState('');
  const [tipo, setTipo] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 8 };
        if (search) params.search = search;
        if (selectedCategory) params.category_id = selectedCategory;
        if (epoca) params.epoca = epoca;
        if (tipo) params.tipo = tipo;

        const { data } = await api.get('/products', { params });
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error cargando catálogo:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, selectedCategory, epoca, tipo, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Catálogo de Libros</h1>

      {/* Barra de Filtros (RF-02.2: Género, autor, época, tipo) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Título, autor o ISBN..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
            className="w-full py-2 px-3 border rounded-lg text-sm bg-white outline-none"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Filtrar por época (ej. Siglo XX)"
          value={epoca}
          onChange={(e) => { setEpoca(e.target.value); setPage(1); }}
          className="w-full py-2 px-3 border rounded-lg text-sm outline-none"
        />

        <select
          value={tipo}
          onChange={(e) => { setTipo(e.target.value); setPage(1); }}
          className="w-full py-2 px-3 border rounded-lg text-sm bg-white outline-none"
        >
          <option value="">Todos los formatos</option>
          <option value="Tapa Blanda">Tapa Blanda</option>
          <option value="Tapa Dura">Tapa Dura</option>
          <option value="Físico">Físico</option>
          <option value="Digital">Digital</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center py-12 text-slate-500">Cargando catálogo...</p>
      ) : products.length === 0 ? (
        <p className="text-center py-12 text-slate-500">No se encontraron libros con los filtros seleccionados.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    page === p ? 'bg-indigo-600 text-white' : 'bg-white border hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import api from '../services/app';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    codigo_barras: '',
    nombre: '',
    autor: '',
    epoca: '',
    tipo: 'Tapa Blanda',
    precio: '',
    stock: '',
    imagen_url: '',
    category_id: ''
  });

  const loadData = async () => {
    const [prodRes, catRes] = await Promise.all([
      api.get('/products?limit=100'),
      api.get('/categories')
    ]);
    setProducts(prodRes.data.products);
    setCategories(catRes.data);
    if (catRes.data.length > 0 && !form.category_id) {
      setForm((prev) => ({ ...prev, category_id: catRes.data[0].id }));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
      } else {
        await api.post('/products', form);
      }
      setEditingId(null);
      setForm({
        codigo_barras: '',
        nombre: '',
        autor: '',
        epoca: '',
        tipo: 'Tapa Blanda',
        precio: '',
        stock: '',
        imagen_url: '',
        category_id: categories[0]?.id || ''
      });
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al guardar producto');
    }
  };

  const handleEdit = (prod) => {
    setEditingId(prod.id);
    setForm({
      codigo_barras: prod.codigo_barras,
      nombre: prod.nombre,
      autor: prod.autor || '',
      epoca: prod.epoca || '',
      tipo: prod.tipo || 'Tapa Blanda',
      precio: prod.precio,
      stock: prod.stock,
      imagen_url: prod.imagen_url || '',
      category_id: prod.category_id
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Dar de baja lógicamente este libro?')) return;
    await api.delete(`/products/${id}`);
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-slate-900">Panel de Administración e Inventario</h1>

      {/* Formulario Alta / Edición */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <h2 className="text-lg font-bold">{editingId ? 'Editar Producto' : 'Registrar Nuevo Libro'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Código de barras / ISBN *"
            required
            value={form.codigo_barras}
            onChange={(e) => setForm({ ...form, codigo_barras: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Título del libro *"
            required
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Autor"
            value={form.autor}
            onChange={(e) => setForm({ ...form, autor: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Precio (> 0) *"
            required
            value={form.precio}
            onChange={(e) => setForm({ ...form, precio: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="number"
            min="0"
            placeholder="Stock inicial *"
            required
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Época (ej. Siglo XIX)"
            value={form.epoca}
            onChange={(e) => setForm({ ...form, epoca: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Tipo (ej. Tapa Dura)"
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="url"
            placeholder="URL de portada (opcional)"
            value={form.imagen_url}
            onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-2">
          <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 hover:bg-indigo-700">
            <Plus className="h-4 w-4" /> {editingId ? 'Guardar Cambios' : 'Agregar al Inventario'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="bg-slate-200 px-4 py-2 rounded-lg text-sm"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabla de Inventario */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 border-b text-slate-600">
              <th className="p-3">Código</th>
              <th className="p-3">Título</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Stock</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono text-xs">{p.codigo_barras}</td>
                <td className="p-3 font-medium">{p.nombre}</td>
                <td className="p-3">{p.category?.nombre}</td>
                <td className="p-3">${parseFloat(p.precio).toFixed(2)}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center gap-1 font-bold ${p.alerta_bajo_stock ? 'text-amber-600' : 'text-slate-800'}`}>
                    {p.stock}
                    {p.alerta_bajo_stock && <AlertTriangle className="h-4 w-4" title="Bajo Stock" />}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => handleEdit(p)} className="text-indigo-600 hover:text-indigo-900">
                    <Edit className="h-4 w-4 inline" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
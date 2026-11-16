import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, ShieldCheck, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-950 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight">
            <img
              src="/thoth.png"
              alt="Logo LibreríaPro"
              className="h-7 w-7 object-contain"
            />
            <span>Librería<span className="text-amber-400">Thoth</span></span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-amber-300 transition">Inicio</Link>
            <Link to="/catalog" className="hover:text-amber-300 transition">Catálogo</Link>
            {user && (
              <Link to="/orders" className="flex items-center gap-1 hover:text-amber-300 transition">
                <Package className="h-4 w-4" />
                {isAdmin ? 'Todas las Órdenes' : 'Mis Compras'}
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 bg-amber-500 text-slate-950 px-3 py-1.5 rounded-md font-semibold hover:bg-amber-400 transition"
              >
                <ShieldCheck className="h-4 w-4" />
                Panel Admin
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-indigo-900 transition"
              aria-label="Abrir carrito"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-indigo-200 hidden sm:inline">
                  Hola, <strong>{user.nombre}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm bg-indigo-800 hover:bg-red-600 px-3 py-1.5 rounded-md transition"
                >
                  <LogOut className="h-4 w-4" />
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="flex items-center gap-1 text-sm hover:text-amber-300 px-3 py-1.5">
                  <User className="h-4 w-4" />
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-amber-400 text-slate-950 font-semibold px-3 py-1.5 rounded-md hover:bg-amber-300 transition"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
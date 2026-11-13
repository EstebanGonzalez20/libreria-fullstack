export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm">
        <p>© {new Date().getFullYear()} Librería Thot - Sistema de Gestión de Inventario y Punto de Venta.</p>
        <p className="mt-2 sm:mt-0">React · Node.js · Express · Sequelize · MySQL</p>
      </div>
    </footer>
  );
}
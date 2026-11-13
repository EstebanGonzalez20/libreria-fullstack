# TASKS.md (Plan de Trabajo / Backlog)

### Fase 1: Configuración Base e Infraestructura
- [ ] Inicializar repositorio Git y estructurar carpetas `/backend` y `/frontend`.
- [ ] Configurar servidor Node.js + Express.
- [ ] Configurar conexión MySQL a través de Sequelize.

### Fase 2: Modelado de Datos y Backend Core
- [ ] Crear modelos Sequelize (`User`, `Category`, `Product`, `Order`, `OrderItem`).
- [ ] Definir migraciones y relaciones entre modelos.
- [ ] Implementar middleware de autenticación JWT.
- [ ] Crear controladores y rutas para `/api/products` y `/api/categories`.
- [ ] Crear controlador transaccional para `/api/orders` (descuento de stock automático).

### Fase 3: Frontend
- [ ] Configurar Vite + React y react-router-dom.
- [ ] Crear AuthContext para manejo de sesiones.
- [ ] Diseñar vistas públicas: Catálogo, Filtros por Categoría, Detalle de Producto.
- [ ] Diseñar Carrito de Compras (CartContext) y pantalla de Checkout.
- [ ] Diseñar Panel de Administración (Gestión de Stock, Altas/Bajas).

### Fase 4: Pruebas y Cierre
- [ ] Probar flujo completo de compra y ajuste de stock en base de datos.
- [ ] Validar reglas de negocio (ej. intentar comprar sin stock suficiente).
- [ ] Redactar documentación de instalación en `README.md`.
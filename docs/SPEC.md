# SPEC.md (Especificación Técnica)

1. Objetivo y Alcance
Desarrollar una aplicación full-stack que resuelva la venta de artículos de librería y el control de inventario en tiempo real.

2. Reglas de Negocio (RN)
RN-01 (Stock Mínimo): No se puede procesar una venta si la cantidad solicitada supera el stock_actual del producto.
RN-02 (Precios): Todo producto debe poseer un precio unitario mayor a cero (>0).
RN-03 (Descuentos): Si una venta supera una cantidad N de unidades de una misma categoría (ej. mayorista), se aplica un % configurable de descuento.
RN-04 (Estados de Orden): Una orden pasa por los estados: PENDIENTE, PAGADO, CANCELADO, COMPLETADO.

3. Modelo de Base de Datos (Sequelize ERD)
Entidades y Relaciones
User: id, nombre, email, password_hash, role (ADMIN/CLIENTE).
Category: id, nombre, descripcion.
Product: id, codigo_barras, nombre, precio, stock, category_id.
Order: id, user_id, fecha, total, estado.
OrderItem: id, order_id, product_id, cantidad, precio_unitario.

4. Endpoints de la API REST
Autenticación (/api/auth)
POST /api/auth/register - Registro de nuevos clientes.
POST /api/auth/login - Autenticación y retorno de JWT token.
Productos (/api/products)
GET /api/products - Obtener catálogo filtrado/paginado.
GET /api/products/:id - Obtener detalle de producto.
POST /api/products - Crear producto (Requiere Admin).
PUT /api/products/:id - Actualizar producto (Requiere Admin).
DELETE /api/products/:id - Eliminación física/lógica (Requiere Admin).
Órdenes / Ventas (/api/orders)
POST /api/orders - Crear orden de compra.
GET /api/orders - Listar órdenes (Clientes ven las suyas, Admins ven todas).
GET /api/orders/:id - Obtener detalle de una orden.
PATCH /api/orders/:id/status - Cambiar estado de orden (Requiere Admin).

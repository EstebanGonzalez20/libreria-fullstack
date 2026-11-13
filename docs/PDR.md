# PRD.md (Product Requirement Document)

## Visión General
El objetivo es construir un sistema Web Full-Stack para la gestión de inventario y punto de venta/e-commerce de una librería (venta de libros).

## Requisitos Funcionales
RF-01: Autenticación y Autorización
RF-01.1: Inicio de sesión y registro de usuarios con JWT.
RF-01.2: Roles de usuario: Admin (gestión total) y Cliente (compra de artículos).
RF-02: Gestión de Productos e Inventario (CRUD)
RF-02.1: Registro, edición, eliminación lógica y visualización de artículos.
RF-02.2: Categorización (Género, autor, epoca, tipo).
RF-02.3: Control de Stock: alerta de bajo stock y actualización automática post-venta.
RF-03: Ventas y Carrito de Compras
RF-03.1: Agregar, modificar y quitar artículos del carrito.
RF-03.2: Procesamiento de órdenes de compra.
RF-03.3: Registro e historial de ventas detallado.

## Requisitos No Funcionales (RNF)
RNF-01: Persistencia relacional en MySQL garantizando la integridad referencial a través de Sequelize.
RNF-02: Respuestas de la API RESTful por debajo de los 200ms en condiciones normales.
RNF-03: Frontend SPA responsive desarrollado en React.

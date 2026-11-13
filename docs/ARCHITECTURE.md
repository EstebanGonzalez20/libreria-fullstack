4. ARCHITECTURE.md (Arquitectura del Sistema)
1. Diagrama de Capas (C4 Model - Nivel Componentes)
[ React Frontend ] ──( HTTP REST / JSON )──> [ Express Router ]
                                                     │
                                           [ Middlewares (Auth JWT) ]
                                                     │
                                           [ Controllers ]
                                                     │
                                           [ Sequelize Models ]
                                                     │
                                             [ MySQL Database ]
2. Estructura de Directorios del Código
Backend (Node.js + Express)
```text
backend/
├── src/
│   ├── config/        # Configuración de BD (database.js)
│   ├── controllers/   # Lógica de endpoints (productController.js, orderController.js)
│   ├── middlewares/   # Auth, validación de schemas (authMiddleware.js)
│   ├── models/        # Modelos Sequelize (User.js, Product.js, Order.js)
│   ├── routes/        # Definición de rutas API
│   └── app.js         # Entry point
```

Frontend (React)
```text
frontend/
├── src/
│   ├── components/    # Navbar, Footer, ProductCard, CartModal
│   ├── context/       # AuthContext, CartContext
│   ├── pages/         # Home, Catalog, Checkout, AdminDashboard
│   ├── services/      # Cliente HTTP Axios (api.js)
│   └── App.jsx
```
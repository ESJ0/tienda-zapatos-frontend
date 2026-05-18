# 👟 ESJ0 Footwear — Frontend

Interfaz de usuario para la tienda de zapatos ESJ0. Construida con **React + Vite**.

## Stack
- **React 18** + Vite
- **React Router v6**
- **Axios**
- **Recharts**
- **Docker + Nginx**
- **GitHub Actions** + **GitHub Pages**

---

## Repositorios
| backend  | https://github.com/ESJ0/tienda-zapatos-backend.git  |
| frontend | https://github.com/ESJ0/tienda-zapatos-frontend.git |

## Producción

| Servicio | URL |
|----------|-----|
| Frontend | https://esj0.github.io/tienda-zapatos-frontend                  |
| API      | https://tienda-zapatos-backend-production.up.railway.app/health |

## 🚀 Levantar con Docker

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd tienda-zapatos-frontend

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Construir y correr
docker build -t zapatos-frontend .
docker run -p 3000:80 zapatos-frontend
```

La aplicación estará en `http://localhost:3000`.

> El backend debe estar corriendo en `http://localhost:8080` antes de levantar el frontend.

---

## 🛠️ Desarrollo local

```bash
# Requisitos: Node 20+

# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Correr en desarrollo
npm run dev
# → http://localhost:3000
```

---

## 🔑 Credenciales de prueba

| Campo    | Valor      |
|----------|------------|
| Usuario  | `admin`    |
| Password | `admin123` |

---

## 🗺️ Rutas

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/` | Catálogo público de productos | Público |
| `/login` | Inicio de sesión | Público |
| `/dashboard` | Overview con gráficas y stats | Protegida |
| `/dashboard/products` | CRUD de productos | Protegida |
| `/dashboard/sales` | Ventas y crear venta | Protegida |
| `/dashboard/customers` | CRUD de clientes | Protegida |
| `/dashboard/employees` | CRUD de empleados (admin) | Protegida |
| `/dashboard/reports` | Reportes + export CSV | Protegida |

---

## ✅ Criterios de rúbrica cubiertos

| Criterio | Implementación |
|----------|----------------|
| React Router ≥4 rutas | 8 rutas distintas |
| React Context | `AuthContext` + `CartContext` |
| `useState` + `useEffect` + `useCallback`/`useMemo` | En hooks, contextos y páginas |
| `useReducer` | Carrito de compras en `CartContext` |
| Formularios controlados + validación | Login, Products, Customers, Employees, Sales |
| Reporte con datos reales | Gráficas de barras, pie chart y tablas en `/dashboard/reports` |
| Manejo visible de errores | Mensajes de validación y feedback en todos los formularios |
| Solo admin gestiona empleados | `isAdmin` desde `AuthContext`, UI oculta acciones para no admins |
| Export CSV | 3 exportaciones en `/dashboard/reports` |

---

## 🐳 Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL base de la API | `http://localhost:8080/api` |

---

## 📁 Estructura del proyecto

```
tienda-zapatos-frontend/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── shoes/
│   │   ├── nike-air-force-1.png
│   │   └── ...
│   └── 404.html
├── src/
│   ├── api/axios.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── hooks/useFetch.js
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Footer.jsx
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Badge.jsx
│   │   │   └── StatCard.jsx
│   │   └── catalog/
│   │       ├── ProductCard.jsx
│   │       └── ProductFilters.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Catalog.jsx
│   │   └── dashboard/
│   │       ├── Overview.jsx
│   │       ├── Products.jsx
│   │       ├── Sales.jsx
│   │       ├── Customers.jsx
│   │       ├── Employees.jsx
│   │       └── Reports.jsx
│   ├── routes/ProtectedRoute.jsx
│   ├── utils/exportCsv.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .dockerignore
├── Dockerfile
├── nginx.conf
├── index.html
├── vite.config.js
└── package.json
```
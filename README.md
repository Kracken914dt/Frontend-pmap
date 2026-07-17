# PMAP - Panel de Control del Módulos de Software (Frontend)

Este es el frontend de la plataforma **PMAP**, una aplicación web moderna diseñada para la administración y coordinación de perfiles de usuario, planeación de materias académicas y agendamiento de sesiones de estudio en tiempo real.

---

## 🛠️ Tecnologías Utilizadas

El proyecto está construido con un stack de desarrollo web moderno y de alto rendimiento:

1. **React (v18.3.1)**: Biblioteca principal para la construcción de la interfaz de usuario basada en componentes reactivos y SPA (Single Page Application).
2. **Vite (v5.4.2)**: Entorno y empaquetador de desarrollo ultrarrápido que reemplaza a CRA (Create React App).
3. **Tailwind CSS (v3.4.10)**: Framework CSS orientado a utilidades para un diseño responsivo, moderno y altamente personalizado.
4. **React Router DOM (v6.26.2)**: Biblioteca para la gestión de navegación y rutas dinámicas en el frontend.
5. **React Hook Form (v7.52.2)**: Gestión eficiente y optimizada de formularios con validación ligera.
6. **Lucide React (v0.468.0)**: Biblioteca de iconos minimalistas vectoriales (SVG) de alto impacto visual.
7. **SweetAlert2 (v11.14.5)**: Ventanas emergentes (modales de alerta y confirmación) personalizadas y estilizadas.
8. **Axios (Intercepcción simulada)**: Cliente HTTP para peticiones AJAX.

---

## 🏗️ Arquitectura de la Aplicación

La aplicación sigue una arquitectura desacoplada y modular orientada a componentes de React, utilizando un **Patrón Mockup / Cliente Autónomo**:

* **Capa de Vistas (Pages)**: Componentes contenedores de nivel de página que gestionan el estado local, llaman a servicios y representan la estructura principal.
* **Capa de Componentes (Components)**: Bloques de construcción UI reutilizables y sin estado complejo (Navbar, Sidebar, Footer, Loader, Modales).
* **Capa de Ruteo (Routes)**: Define la estructura de navegación. Incluye un bypass de seguridad (`ProtectedRoute`) para fines de pruebas y acceso libre.
* **Capa de Abstracción de Datos (API/HTTP Mock)**: Un interceptor personalizado que emula las respuestas de un servidor backend real mediante operaciones CRUD síncronas que leen y escriben en el `localStorage` del navegador. Esto elimina la necesidad de contar con una base de datos activa para el funcionamiento local.

---

## 📁 Estructura de Directorios

La estructura del proyecto está organizada de la siguiente manera:

```text
Frontend/
├── public/                 # Recursos estáticos públicos del navegador
├── src/
│   ├── api/
│   │   ├── http.js         # Cliente Axios simulado (Mock HTTP interceptor)
│   │   └── mockData.js     # Base de datos local simulada en localStorage con CRUD
│   ├── components/         # Componentes globales de la interfaz (Navbar, Sidebar, etc.)
│   ├── hooks/
│   │   └── useAuth.js      # Hook personalizado para obtener la sesión del usuario actual
│   ├── layouts/
│   │   └── MainLayout.jsx  # Layout maestro de la app (Navbar + Sidebar + Main Content + Footer)
│   ├── pages/              # Páginas correspondientes a cada ruta de la aplicación
│   │   ├── DashboardPage.jsx  # Tablero principal de estadísticas
│   │   ├── LoginPage.jsx      # Página de inicio de sesión y registro
│   │   ├── MateriasPage.jsx   # Vista de administración de materias académicas
│   │   ├── PerfilPage.jsx     # Perfil del usuario autenticado
│   │   ├── SesionesPage.jsx   # Gestión de agendamiento de sesiones de estudio
│   │   └── NotFoundPage.jsx   # Pantalla de error 404
│   ├── routes/
│   │   ├── AppRouter.jsx      # Definición de rutas del sistema
│   │   └── ProtectedRoute.jsx # Wrapper de rutas con bypass de autenticación para pruebas
│   ├── utils/
│   │   └── storage.js         # Utilidades de almacenamiento (tokens y usuarios) con fallback mock
│   ├── App.jsx             # Componente raíz de la aplicación
│   ├── index.css           # Estilos globales y directivas de Tailwind CSS
│   └── main.jsx            # Punto de entrada de la aplicación React
├── package.json            # Configuración de scripts y dependencias
├── tailwind.config.js      # Personalización de temas y colores de Tailwind CSS
└── vite.config.js          # Configuración del servidor y empaquetado de Vite
```

---

## 💻 Componentes Principales y Flujo de Trabajo

### 1. Simulación de Base de Datos (`src/api/mockData.js`)
Este script actúa como el motor de base de datos en memoria del cliente. Al cargarse por primera vez, lee de `localStorage` o inicializa datos por defecto para:
* **Usuarios**: Administradores y estudiantes registrados.
* **Materias**: Asignaturas divididas por categorías.
* **Sesiones de Estudio**: Vinculan estudiantes con materias, definiendo horas de inicio/fin y metas.

Ofrece métodos similares a un ORM como `mockUsuarios.create()`, `mockMaterias.getAll()`, etc.

### 2. Capa HTTP Mock (`src/api/http.js`)
En lugar de disparar peticiones REST reales a `http://localhost:8080/api`, este cliente mock intercepta las solicitudes simulando los métodos `get()`, `post()`, `put()` y `delete()`. Devuelve promesas que resuelven en respuestas compatibles con Axios (`{ data: ... }`). Además, incluye un retardo de `200ms` para asegurar que el feedback visual (spinners de carga) funcione correctamente.

### 3. Rutas y Bypass de Sesión
El enrutador central `AppRouter.jsx` protege las páginas internas mediante `ProtectedRoute.jsx`. Para facilitar las pruebas sin servidor:
* `ProtectedRoute.jsx` se configuró para dar paso libre a cualquier página.
* `storage.js` devuelve un usuario administrador por defecto (`Diego Tique`) si el usuario no ha iniciado sesión manualmente, garantizando que ninguna vista quede rota o sin datos contextuales.

---

## 🚀 Instrucciones para Ejecución Local

1. **Instalar Dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar el Servidor de Desarrollo**:
   ```bash
   npm run dev
   ```

3. **Acceder a la Aplicación**:
   Abre [http://localhost:5173/](http://localhost:5173/) en tu navegador.

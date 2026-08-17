# Prueba técnica — Fullstack Developer Trainee / Junior

Aplicación web para gestionar artículos de blog con autenticación, panel privado, página pública y búsqueda realizada desde el servidor.

## Objetivo

Crear una aplicación simple para gestionar artículos de blog, evaluando la resolución completa de un problema de producto de punta a punta: interfaz, formularios, autenticación, API, persistencia y manejo de datos.

---
## Uso de IA
 
Durante el desarrollo utilicé distintas herramientas de IA según la etapa del trabajo:
 
- **GitHub Copilot/Claude**: lo use para la resolución de errores puntuales de tipado/librerías,autocompletado y generación de código endpoints, componentes, hooks de TanStack Query/Form.
- **Gemini**: Aparte de ver su documentacion en la su pagina web tambien consulte de documentación de las librerías pedidas (Better Auth, Hono, TanStack).
### Otras herramientas
 
- **[Color Hunt](https://colorhunt.co/)**: Use esta pagina para elegir la paleta de colores.


## Stack tecnológico

- **Frontend:** React + TypeScript + Vite + HeroUI
- **Datos y routing:** TanStack Query + TanStack Router
- **Formularios:** TanStack Form
- **Backend:** Hono
- **Base de datos:** MongoDB (driver nativo)
- **Validación:** Zod
- **Autenticación:** Better Auth

---

## Funcionalidades requeridas

### Autenticación

- Registro de usuario con email y contraseña
- Inicio de sesión
- Cierre de sesión
- Protección de rutas privadas
- Uso de Better Auth
- Validación de formularios y API con Zod

### Artículos

Cada usuario autenticado puede:

- crear un artículo con título, contenido e imagen opcional;
- ver el listado de sus propios artículos;
- navegar por paginación;
- editar sus propios artículos;
- eliminar sus propios artículos;
- ver el detalle del artículo completo, incluyendo nombre del autor y fecha de creación.

Las operaciones de edición y eliminación validan del lado del servidor que el artículo pertenece al usuario autenticado.

### Página pública

- listado de autores registrados;
- cantidad de artículos por autor;
- buscador de artículos por:
  - título;
  - contenido;
  - nombre del autor;
- búsqueda ejecutada desde el servidor;
- paginación de resultados;
- diseño adaptado para desktop y mobile.

---

## Requisitos técnicos cumplidos

- Frontend con React, TypeScript, Vite y HeroUI
- TanStack Query y TanStack Router
- TanStack Form
- API con Hono
- Validación con Zod
- MongoDB con driver nativo
- Better Auth
- Proyecto ejecutable con instrucciones claras de instalación y montaje local

---

## Requisitos previos

- Node.js 18 o superior
- npm
- MongoDB local corriendo en `localhost:27017`

---

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/Diego-Ruda/Wortise-Desafio-Tecnico.git
cd Wortise-Desafio-Tecnico
```

### 2. Instalar dependencias

Desde la raíz del proyecto:

```bash
npm install
```

Instala también los workspaces del monorepo de: (`client`, `server` y `shared`).

### 3. Crear los archivos de entorno

#### Backend

Dentro de la carpeta `server`:

```bash
cp .env.example .env
```

#### Frontend

Dentro de la carpeta `client`:

```bash
cp .env.example .env
```


### 4. Levantar MongoDB

```bash
mongod
```

### 5. Subir el seed
Dentro de la carpeta `server`:
```bash
cd server
npm run seed 
```
en caso de elimina todos los datos
```bash
npm run cleanup
```
### 6. Ejecutar la aplicación

Desde la raíz:

```bash
npm run dev
```

Esto levanta:

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

También podés correr cada parte por separado:

```bash
npm run dev:server
npm run dev:client
```
---

## Build y ejecución en producción

Para compilar el proyecto y verificar el funcionamiento del código generado en producción localmente:

### 1. Compilar proyectos (Frontend y Backend)

Desde la raíz del proyecto:

```bash
npm run build
```
### 2. Iniciar el servidor compilado

Desde la raíz del proyecto:

```bash
npm run start
```

## Variables de entorno

### Backend (server/.env)

```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/nombre-de-tu-db
BETTER_AUTH_SECRET=clave_secreto_aqui_muy_largo
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:5173
CLIENT_URL=http://localhost:5173
```

### Frontend (client/.env)

```bash
VITE_API_URL=http://localhost:3000
```
---

## Scripts disponibles

Desde la raíz del proyecto (resumen):

```bash
npm run dev
npm run dev:client
npm run dev:server
npm run build
npm run build:client
npm run build:server
```

---

## Consideraciones de proyecto

- **Monorepo con client, server y shared**: Aunque no se menciono en la prueba tecnica se meciono en la postulacion asi que añadi el monorepo con lo que permitio centralizar los schemas de Zod y evitar duplicación entre frontend y backend.
- **Better Auth**: se usa para manejar registro, login, logout y protección de sesiones.
- **TanStack Query**: se usa para consultar, crear, editar y eliminar artículos, y para invalidar caché tras mutaciones.
- **TanStack Router**: se usa para proteger las rutas privadas del panel de administración.
- **Zod**: usado tanto en formularios como en validación de endpoints del backend.
- **MongoDB**: persistencia nativa del driver de MongoDB.
- **Paleta visual**: definida con variables CSS para soportar diseño claro y oscuro con una experiencia visual consistente.






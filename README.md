# CMPC-libros

Este proyecto corresponde a una prueba técnica cuyo objetivo es desarrollar una aplicación web completa para digitalizar el proceso de gestión de inventario de libros.

## Tecnologías utilizadas

- **Backend:** NestJS + TypeScript + Sequelize + PostgreSQL
- **Frontend:** React + TypeScript + Vite
- **Autenticación:** JWT con cookies HttpOnly
- **Base de datos:** PostgreSQL
- **DevOps:** Docker, Docker Compose
- **Testing:** Jest (backend) con 100% de cobertura

## Requisitos

- Docker
- Docker Compose

## Instalación y ejecución

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/cmpc-libros.git
cd cmpc-libros
```

2. Crea el archivo `.env` basado en el archivo `.env.example` en la raíz del proyecto.

3. Levanta toda la aplicación (frontend + backend + base de datos) con:

```bash
docker-compose up --build
```

Esto expondrá:

- Frontend: http://localhost:5173
- Backend (API REST): http://localhost:3001
- PostgreSQL: puerto 5432

## Autenticación

El login se realiza con `username` y `password`. La autenticación se gestiona vía JWT almacenado en cookies httpOnly. Las rutas protegidas requieren un token válido.

## Funcionalidades

### Backend

- Autenticación de usuarios (login, registro)
- CRUD de libros con:
  - Filtros por género, autor, editorial y disponibilidad
  - Paginación del lado del servidor
  - Ordenamiento dinámico
  - Soft delete
  - Exportación de libros a CSV
  - Carga de imágenes
- Validaciones y manejo global de errores
- Logging y auditoría (registro de eventos clave)
- Cobertura 100% de testing con Jest
- Documentación con Swagger

### Frontend

- Login de usuarios autenticados
- Listado de libros con:
  - Búsqueda con debounce
  - Filtros y orden dinámico
  - Paginación
- Formulario de creación y edición de libros
- Visualización de detalles de un libro
- Carga de imágenes
- Exportación de CSV con todos los libros
- Logout disponible en todo momento tras autenticación

## Arquitectura

El sistema se divide en tres servicios:

1. **frontend** (React + Vite): cliente SPA que consume la API.
2. **backend** (NestJS): servidor API REST que maneja autenticación y lógica de negocio.
3. **db** (PostgreSQL): base de datos relacional persistente.

Los servicios están orquestados con Docker Compose. El backend expone un API REST autenticado mediante JWT. Los tokens son entregados en cookies seguras, y el frontend se comunica con `withCredentials` habilitado.

## Comandos útiles

- Ejecutar pruebas en backend:

```bash
docker exec -it backend npm run test
```

- Ver cobertura de pruebas:

```bash
docker exec -it backend npm run test:cov
```

## Documentación API

Una vez en ejecución, accede a la documentación Swagger en:

```
http://localhost:3001/api/docs#/
```

## Observaciones

Este proyecto fue desarrollado como prueba técnica. Todos los criterios solicitados fueron cumplidos: autenticación, filtros, ordenamientos, paginación, carga de imágenes, validaciones, cobertura de pruebas, documentación, exportación CSV, manejo de errores, arquitectura desacoplada y despliegue vía Docker.
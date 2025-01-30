# IMDb Simplificado

Este proyecto es una aplicación web inspirada en IMDb, desarrollada con Angular 19.0.6 y Material UI. Permite gestionar películas, actores y usuarios con diferentes roles (Viewer y Admin).

## Características principales

- Autenticación de usuarios (Login/Registro)
- Roles de usuario: Viewer y Admin
- CRUD completo para películas y actores
- Búsqueda avanzada de películas y actores
- Paginación y ordenación de resultados
- Sistema de calificaciones
- Gestión de imágenes para películas y actores
- Interfaz responsive y moderna

## Tecnologías utilizadas

- Angular 19
- Angular Material
- RxJS
- TypeScript
- Tailwind CSS

## Instalación y uso

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/imdb-simplificado.git
```

2. Instala las dependencias:

```bash
cd imdb-simplificado
npm install
```
3. Inicia el servidor de desarrollo:

```bash
ng serve
```
4. Abre tu navegador y accede a `http://localhost:4200/`.

## Estructura del proyecto

```
src/
├── app/
│ ├── features/
│ │ ├── auth/ # Autenticación y registro
│ │ ├── movies/ # Gestión de películas
│ │ ├── actors/ # Gestión de actores
│ │ └── users/ # Gestión de usuarios
│ ├── shared/ # Componentes y servicios compartidos
│ └── app.component.ts # Componente principal
├── assets/ # Recursos estáticos
└── environments/ # Configuraciones de entorno
```

# Documentación de la API
[Documentación de Postman](https://documenter.getpostman.com/view/31220407/2sAYX2LiiV)
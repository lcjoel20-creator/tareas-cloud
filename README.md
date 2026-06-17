# 📋 Tareas Colaborativas en Tiempo Real

Una aplicación web moderna orientada a la gestión de tareas distribuidas en equipo. Permite la creación, actualización de estado (completado/pendiente) y eliminación de tareas de forma colaborativa y con sincronización instantánea (Realtime) entre múltiples clientes.

## 🚀 Características

- **Sincronización en Tiempo Real:** Los cambios aplicados por cualquier miembro del equipo se reflejan instantáneamente en todas las pantallas abiertas gracias a WebSockets mediante Supabase Realtime.
- **Diseño Adaptable (Responsivo):** Interfaz limpia, optimizada para dispositivos móviles, tablets y ordenadores de escritorio.
- **Arquitectura Serverless:** Conexión directa desde el frontend a la base de datos en la nube de forma segura sin requerir un servidor backend tradicional.

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Estructura semántica de la interfaz de usuario.
- **CSS3:** Diseño personalizado, paleta de colores moderna con variables CSS y Flexbox responsivo.
- **JavaScript (Vanilla JS):** Lógica de control de la interfaz, manipulación del DOM y manejo de eventos.
- **Supabase SDK:** Integración de la base de datos PostgreSQL en la nube, autenticación implícita mediante llaves públicas y suscripción al canal de cambios distribuidos.

## 📂 Estructura del Proyecto

```text
tareas-cloud/
├── .gitignore       # Archivos excluidos del control de versiones
├── app.js           # Lógica de la aplicación y conexión con Supabase
├── index.html       # Interfaz principal de la aplicación
├── README.md        # Documentación del proyecto (Este archivo)
└── style.css        # Estilos estéticos y diseño responsivo
```

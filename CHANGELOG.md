# 📘 CHANGELOG — Frontend (Ionic / Angular)

## [1.3.0] — 2026-04-29

### Added
- Módulo completo de **Inventario de Dispositivos Informáticos**.
- Vista `listado-dispositivos` en grilla de 6 columnas (desktop) / 3 columnas (móvil), con iconos diferenciados por tipo (`desktop-outline` para PC, `laptop-outline` para Notebook).
- Filtros por tipo de equipo y búsqueda por área en `listado-dispositivos`, fuera de card siguiendo el patrón de "Mis tickets".
- Ordenamiento por nombre asignado, área e IP (ascendente y descendente) — 100% frontend.
- Texto con ellipsis en cards para mantener uniformidad visual independiente del largo del contenido.
- Vista `detalle-dispositivo` con información completa del equipo y formulario de edición inline para `admin` y `soporte`.
- `DispositivoService` con métodos `listarDispositivos()`, `obtenerDispositivoPorId()`, `crearDispositivo()` y `actualizarDispositivo()`.
- Rutas `/listado-dispositivos` y `/detalle-dispositivo/:id_dispositivo` registradas en `app-routing.module.ts`.
- Card "Dispositivos" agregada al panel principal con navegación al módulo.

### Compatibility
- Probado con Backend `1.3.0`.

### Notes
- Release completo del grupo funcional **Inventario de Dispositivos** (MVP).
- El módulo fue presentado al jefe como MVP para validación antes de definir el alcance final.
- La siguiente iteración (`En dispositivos considerar programas y sistemas`) queda en backlog.

---

## [1.2.0] — 2026-04-27

### Added
- Módulo completo **Agenda de Mantenciones** accesible desde el panel principal.
- Página `programar-mantenimiento` con formulario de creación de mantenciones — campos título, descripción, fecha, hora inicio y hora término. Selector adaptado a plataforma: `ion-datetime` en móvil, input nativo en desktop.
- Página `agenda-mantenimiento` con vista Lista y vista Calendario intercambiables mediante `ion-segment`.
  - Vista Lista: filtro por período (Hoy / Esta semana / Este mes) y por estado, con navegación ← → entre períodos y agrupación por fecha.
  - Vista Calendario: vistas Mes y Semana con navegación entre períodos, eventos con color según estado (amarillo propuesto, verde confirmado, azul/morado reprogramado, rojo cancelado) y panel de detalle al hacer click en un día.
- Página `detalle-agenda-mant` con información completa de la mantención, acciones de gestión por rol (confirmar, reprogramar, cancelar), feed de actividades y caja de comentarios.
- Formulario inline de reprogramación en el detalle — prellenado con los valores actuales, adaptado a plataforma, con validación de conflictos y toast descriptivo ante error 409.
- Feed de actividades en el detalle con iconos diferenciados por tipo de evento (`creacion`, `cambio_estado`, `reprogramacion`, `comentario`).
- `MantencionService` con métodos: `crearMantencion()`, `listarMantenciones()`, `obtenerMantencionPorId()`, `actualizarEstadoMantencion()`, `reprogramarMantencion()`, `obtenerFeedMantencion()`, `agregarComentarioMantencion()`.
- Rutas registradas: `/agenda-mantenimiento`, `/programar-mantenimiento`, `/detalle-agenda-mant/:id_mantencion`.
- Card "Agenda de Mantenciones" agregada al panel principal con navegación al módulo.
- Librería `angular-calendar` + `date-fns` instaladas para la vista calendario.

### Changed
- Angular actualizado de `20.1.4` a `20.x` (requerido por `angular-calendar`).

### Compatibility
- Probado con Backend `1.2.0`.

### Notes
- Release completo del grupo funcional **Agenda de Mantenciones**.
- El filtrado por período en la vista Lista es 100% frontend — se cargan todas las mantenciones una vez y se filtran localmente, sin llamadas extra al backend al navegar entre períodos.
- El click en evento en vista Mes funciona haciendo click en el punto de color dentro del recuadro del día — comportamiento estándar de `angular-calendar`.
- El import CSS de `angular-calendar` requiere ruta absoluta desde `node_modules` por restricción del exports field de la librería: `@import "../node_modules/angular-calendar/css/angular-calendar.css"`.

---

## [1.1.0] — 2026-03-24

### Added
- Selector de tipo de problema al crear ticket, restringido a perfiles `admin` y `soporte`.
- Selector editable de categoría en el detalle del ticket (solo roles autorizados), con actualización inmediata en UI y feed.
- Visualización de tiempo objetivo (rango mínimo–máximo humanizado) y fecha límite de resolución en el detalle del ticket.
- Semáforo SLA en el historial de tickets y en el detalle: verde (en plazo), amarillo (próximo a vencer, > 50% del tiempo consumido), rojo (vencido).
- Toast diferenciado al cerrar ticket según resultado SLA: verde (dentro del plazo), rojo (fuera del plazo), amarillo (sin SLA asignado).

### Changed
- Migración de `tipo_problema` de códigos cortos (`critico`, `hardware`, etc.) a nombres descriptivos completos alineados con la tabla SLA del backend.
- Eliminada capa de traducción de categorías (`categoriasMap`, `traducirCategoria()`, `procesarFeed()`) en `detalle-ticket` — la BD ahora es la fuente de verdad.
- Al guardar categoría desde el detalle, se recarga el ticket completo para reflejar los nuevos valores SLA.
- Nueva columna SLA agregada al encabezado del listado de tickets (desktop y móvil).

### Fixed
- `ion-select-option` de "Habilitación de acceso a internet" estaba fuera del `ion-select` en `detalle-ticket.page.html`.

### Compatibility
- Probado con Backend `1.1.0`.

### Notes
- Release completo del grupo funcional **Implementación de SLA**.
- El umbral del semáforo (50%) es configurable directamente en `getSemaforoSLA()` si se requiere ajuste futuro.

---

## [1.0.0] — 2026-02-16

### Added
- Control de permisos por rol en la UI (PermissionsService) para restringir acciones de tickets según tipo de usuario.
- Ingreso con tecla Enter en pantalla de login para mejorar UX.

### Changed
- Preparación de assets PWA (manifest e íconos). Nota: PWA no se declara operativo en producción; queda como base para futura activación.

### Compatibility
- Probado con Backend `1.0.0`.

### Notes
- Primer release estable en producción (sin sufijos `beta/rc`).

---

## [0.10.0-rc.1] — 2025-10-20

### Added
- Filtro de tickets por estado (abiertos/cerrados).
- Paginación de tickets y opción para seleccionar cantidad por página.

### Changed
- Reordenamiento de tickets por fecha descendente para mejorar la legibilidad.
- Ajuste de vista de tickets para compatibilidad móvil.

### Fixed
- Correcciones menores de estilo y coherencia visual en componentes.

### Compatibility
- Probado con Backend `0.9.0-beta.1`.
- Contrato API sin cambios.

### Notes
- Versión candidata (`RC`) desplegada en entorno de pruebas internas con múltiples mejoras visuales y funcionales.

---

## [0.9.0-rc.1] — 2025-09-28

### Added
- Implementación del flujo principal de tickets: listado, creación, detalle y cierre.
- Autenticación básica con login de usuarios internos.
- Vista "Mis Tickets" con filtrado inicial y estados básicos.
- Componente de cabecera y estructura de navegación.
- Integración con el backend FastAPI (`/tickets`, `/usuarios`).
- Mostrar número de versión en vista "Acerca de".

### Changed
- Ajustes de diseño general (paleta, tipografía, distribución de vistas).
- Correcciones menores de estilo visual.

### Notes
- Primer release de pruebas internas con el departamento de informática y estadística.
- Versión base para validación del flujo de soporte TI.

---

## 📊 Compatibility Matrix

| Frontend | Backend | Estado | Fecha | Notas |
|---|---|---|---|---|
| 1.3.0 | 1.3.0 | ✅ Compatible | 2026-04-29 | Release MVP Inventario de Dispositivos |
| 1.2.0 | 1.2.0 | ✅ Compatible | 2026-04-27 | Release grupo Agenda de Mantenciones |
| 1.1.0 | 1.1.0 | ✅ Compatible | 2026-03-24 | Release grupo SLA |
| 1.0.0 | 1.0.0 | ✅ Compatible | 2026-02-15 | Primera versión estable en producción |
| 0.10.0-rc.1 | 0.9.0-beta.1 | ✅ Compatible | 2025-10-20 | RC en entorno de pruebas internas |
| 0.9.0-rc.1 | 0.8.0-beta.1 | ✅ Compatible | 2025-09-28 | Versión inicial de pruebas |
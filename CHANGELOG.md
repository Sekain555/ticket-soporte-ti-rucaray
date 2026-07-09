# 📘 CHANGELOG — Frontend (Ionic / Angular)

## [1.6.0] — 2026-07-08

### Added
- Función de asignación de tickets con alert de selección — admin puede asignar a cualquier técnico/admin, soporte solo puede asignarse a sí mismo.
- Comentario opcional al asignar ticket — registrado en el feed.
- Campo "TÉCNICO ASIGNADO" visible en detalles del ticket.
- Sistema de notificaciones in-app con polling cada 30 segundos — `BehaviorSubject` + `interval`.
- Icono de campana en header con badge punto rojo para notificaciones no leídas.
- `NotificacionesPopoverComponent` con listado de notificaciones, navegación directa al ticket/mantención y marcado de leídas.
- Sonido de notificación al recibir nuevas notificaciones.
- `NotificacionService` con métodos `iniciarPolling()`, `detenerPolling()`, `forzarActualizacion()`.
- Polling iniciado/detenido desde `app.component.ts` según estado de sesión.
- `MencionarUsuarioModalComponent` con buscador en tiempo real para seleccionar usuarios.
- Botón "@ Mencionar" en comentarios de tickets y mantenciones.
- `UsuarioService` refactorizado con métodos correctamente nombrados: `listarSoporte()`, `listarAdminsYSoporte()`, `listarTodos()`, `listarUsuariosRucaray()`.

### Compatibility
- Probado con Backend `1.5.0`.

### Notes
- Release completo de la **Sección 3 — Asignación y Colaboración**.
- Polling elegido sobre SSE/WebSockets por incompatibilidad con `--workers 2` de uvicorn.
- Convención de mención: `@NombreApellido` sin espacio — búsqueda en BD por `CONCAT(nombre, apellido)`.
- Queda pendiente dar acceso al ticket a usuarios mencionados que no son dueños — anotado como feature futura.

---

## [1.5.0] — 2026-06-18

### Added
- Barra de búsqueda en "Mis tickets" — filtra por título, descripción o N° de ticket con debounce de 400ms.
- Columna "Creado por" en listado de tickets desktop; texto secundario en versión móvil.
- Formulario de edición inline de ticket en columna derecha del detalle, activado desde botón "EDITAR TICKET" — campos según rol.
- Validación de campos obligatorios al crear ticket (título, descripción, prioridad) con toast descriptivo por campo faltante y asterisco en labels.
- Generación de reporte PDF por ticket desde el detalle — librería `html2pdf.js`, 100% frontend, sin dependencias en el servidor.

### Changed
- Selector de categoría eliminado del modo lectura en detalle de ticket — ahora muestra texto para todos los roles y solo es editable desde el formulario de edición.

### Compatibility
- Probado con Backend `1.5.0`.

### Notes
- Release completo de la **Sección 2 — Gestión y Búsqueda de Tickets**.
- El PDF incluye logo Rucaray, cabecera, tabla de información, cronología de actividades y pie de página. Nombre de archivo: `ticket-{id}.pdf`.
- La edición de ticket respeta control de acceso por rol: admin/soporte editan todos los campos; usuarios solo editan tickets abiertos (título, descripción, dispositivo).

---

## [1.4.0] — 2026-05-10

### Added
- `AuthGuard` — protección de rutas que verifica sesión activa antes de permitir navegación, redirige a `/login` si no hay token.
- `AuthInterceptor` — interceptor HTTP global que detecta errores 401 y redirige al login automáticamente.
- Mensaje contextual "Sin tickets" en el listado cuando no hay resultados con el filtro aplicado.
- Redirección automática al detalle del ticket tras crearlo exitosamente.

### Changed
- Token JWT con expiración de 8 horas (configurado en backend).
- Switch Lista/Calendario en Agenda de Mantenciones reemplazado por botones pill personalizados — más limpio y coherente con el diseño del sistema.
- Switch Mes/Semana en vista Calendario también migrado a botones pill.
- Cards del panel principal normalizadas a altura fija de 200px con contenido centrado verticalmente.
- Stickers del panel principal normalizados a 160px con `object-fit: contain`.

### Fixed
- Avatar sobredimensionado en feed de actividades de mantenciones — ajustado a 32px consistente con feed de tickets.

### Compatibility
- Probado con Backend `1.3.0` (sin cambios en backend).

### Notes
- Release completo de la **Sección 1 — Mejoras de UX y Flujo de Tickets**.
- El efecto hover de color en cards del panel principal queda pendiente de refinamiento visual.
- Card "Unificación del flujo de acceso a tickets" movida al final del backlog — se evaluará cuando la adopción del sistema mejore.

---

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
| 1.6.0 | 1.5.0 | ✅ Compatible | 2026-07-08 | Release Asignación y Colaboración |
| 1.5.0 | 1.4.0 | ✅ Compatible | 2026-06-18 | Release Gestión y Búsqueda |
| 1.4.0 | 1.3.0 | ✅ Compatible | 2026-05-10 | Release Mejoras UX y Flujo |
| 1.3.0 | 1.3.0 | ✅ Compatible | 2026-04-29 | Release MVP Inventario de Dispositivos |
| 1.2.0 | 1.2.0 | ✅ Compatible | 2026-04-27 | Release grupo Agenda de Mantenciones |
| 1.1.0 | 1.1.0 | ✅ Compatible | 2026-03-24 | Release grupo SLA |
| 1.0.0 | 1.0.0 | ✅ Compatible | 2026-02-15 | Primera versión estable en producción |
| 0.10.0-rc.1 | 0.9.0-beta.1 | ✅ Compatible | 2025-10-20 | RC en entorno de pruebas internas |
| 0.9.0-rc.1 | 0.8.0-beta.1 | ✅ Compatible | 2025-09-28 | Versión inicial de pruebas |
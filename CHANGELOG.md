# 📘 CHANGELOG — Frontend (Ionic / Angular)

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
| 1.1.0 | 1.1.0 | ✅ Compatible | 2026-03-24 | Release grupo SLA |
| 1.0.0 | 1.0.0 | ✅ Compatible | 2026-02-15 | Primera versión estable en producción |
| 0.10.0-rc.1 | 0.9.0-beta.1 | ✅ Compatible | 2025-10-20 | RC en entorno de pruebas internas |
| 0.9.0-rc.1 | 0.8.0-beta.1 | ✅ Compatible | 2025-09-28 | Versión inicial de pruebas |
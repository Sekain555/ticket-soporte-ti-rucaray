# 📘 CHANGELOG — Frontend (Ionic / Angular)

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
- Vista “Mis Tickets” con filtrado inicial y estados básicos.
- Componente de cabecera y estructura de navegación.
- Integración con el backend FastAPI (`/tickets`, `/usuarios`).
- Mostrar número de versión en vista “Acerca de”.

### Changed
- Ajustes de diseño general (paleta, tipografía, distribución de vistas).
- Correcciones menores de estilo visual.

### Notes
- Primer release de pruebas internas con el departamento de informática y estadística.
- Versión base para validación del flujo de soporte TI.

---

## 📊 Compatibility Matrix

| Frontend | Backend | Estado | Fecha | Notas |
|-----------|----------|--------|--------|-------|
| 1.0.0 | 1.0.0 | ✅ Compatible | 2026-02-15 | Primera versión estable en producción |
| 0.10.0-rc.1 | 0.9.0-beta.1 | ✅ Compatible | 2025-10-20 | RC en entorno de pruebas internas |
| 0.9.0-rc.1 | 0.8.0-beta.1 | ✅ Compatible | 2025-09-28 | Versión inicial de pruebas |

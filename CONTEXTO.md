# CONTEXTO — Sistema Tickets Rucaray (Frontend)

## Stack tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| Angular | 18.x | Framework principal SPA |
| Ionic | 8.x | UI components responsivos |
| TypeScript | 5.x | Lenguaje principal |
| RxJS | 7.x | Programación reactiva (Observables) |
| Angular Router | 18.x | Navegación con lazy loading |
| Angular HttpClient | 18.x | Comunicación REST con el backend |

**Versión actual:** `1.0.0`  
**Compatibilidad backend:** `1.0.0`

---

## Arquitectura

SPA con arquitectura en capas:

1. **Presentation Layer** — Page components (una página = un módulo lazy-loaded)
2. **Shared Components** — `ComponentsModule` con componentes reutilizables (ej. `HeaderComponent`)
3. **Service Layer** — Lógica de negocio e integración con API
4. **Infrastructure** — `localStorage` para sesión, Service Worker para PWA

Todos los servicios son `providedIn: 'root'` (singletons globales).

---

## Rutas principales

| Ruta | Componente | Módulo |
|---|---|---|
| `/login` | `LoginPage` | `LoginPageModule` |
| `/panel-principal` | `PanelPrincipalPage` | `PanelPrincipalPageModule` |
| `/nuevo-ticket` | `NuevoTicketPage` | `NuevoTicketPageModule` |
| `/mis-tickets` | `MisTicketsPage` | `MisTicketsPageModule` |
| `/detalle-ticket` | `DetalleTicketPage` | `DetalleTicketPageModule` |
| `/agenda-mantenimiento` | `AgendaMantenimientoPage` | Vista de agenda (datos estáticos hasta Card 5) |
| `/programar-mantenimiento` | `ProgramarMantenimientoPage` | Formulario de propuesta de mantención |
| `/detalle-agenda-mant/:id_mantencion` | `DetalleAgendaMantPage` | Detalle de mantención |

---

## Servicios core

### AuthService
- Autenticación usuario/contraseña contra el backend
- Almacena en `localStorage`: token JWT, `id_usuario`, nombre, `rol`, preferencia de tema
- `isLoggedIn()` verifica presencia de token válido
- Navigation guards protegen rutas autenticadas
- Logout limpia `localStorage` y redirige a `/login`

### TicketService
- Todas las operaciones CRUD de tickets vía HTTP
- Retorna Observables para integración reactiva con componentes

### PermissionsService
- Verifica permisos por rol para controlar elementos UI y acciones disponibles
- Roles: `admin`, `soporte`, `usuario`

### VersionService
- Control de versión de la aplicación y compatibilidad

### MantencionService
- Operaciones CRUD de mantenciones con la API backend.

---

## Flujo de usuario

```
/login → (token guardado) → /panel-principal → /nuevo-ticket
                                             → /mis-tickets → /detalle-ticket
```

---

## Sesión y autenticación

- Token JWT almacenado en `localStorage`
- Expiración del token manejada por el backend (2 horas)
- Datos de sesión: `token`, `id_usuario`, `nombre`, `rol`, `tema`
- Guards validan sesión antes de permitir acceso a rutas protegidas

---

## PWA

- Configurada con `manifest.webmanifest` y service worker (`ngsw-config.json`)
- `display: standalone`, `theme_color: #1E3A8A`
- 7 tamaños de íconos WebP (48px → 512px)
- **Estado:** base configurada, no declarada operativa en producción aún

---

## Conexión con backend

URL base de la API:
```
http://127.0.0.1:8000
```

---

## Decisiones de arquitectura

| Decisión | Razón |
|---|---|
| Lazy loading por módulo | Optimiza bundle inicial y startup |
| `ComponentsModule` compartido | Evita duplicación de componentes UI |
| Servicios en root | Singleton global, evita múltiples instancias |
| `localStorage` para sesión | Persistencia simple sin backend de sesión |
| `PermissionsService` centralizado | Control de acceso uniforme en toda la UI |

---

## Estado del roadmap

### DONE ✅
- Autenticación con login + Enter para enviar
- Flujo completo de tickets: listado, creación, detalle
- Paginación y filtro por estado (abiertos/cerrados)
- Reordenamiento por fecha descendente
- Vista responsive para móvil
- Control de permisos por rol en UI (`PermissionsService`)
- Definición de tipos de problema (integración con SLA del backend)
- Definición de tipos de problema y SLA (valores alineados con tabla sla_tipos_problema)
- Asignación automática de tiempo objetivo al crear ticket
- Evaluación de cumplimiento SLA al cerrar ticket (toast diferenciado por resultado)
- Visualización de tiempo objetivo y fecha límite en detalle de ticket (rango SLA humanizado)
- Crear y proponer agendamiento (formulario + servicio + navegación desde panel principal)
- Gestión de agendamientos: listado real, detalle y cambio de estado por rol
- Vista de agenda por día/semana: filtro de período, navegación y mensaje contextual
- Feed de actividades en mantenciones (tabla mantencion_feed, registro automático, comentarios)
- Vista Calendario en Agenda de Mantenciones (angular-calendar, vistas mes/semana)
- Flujo de reprogramación con cambio de fecha/hora (formulario inline, validación de conflictos, feed)
- Base de datos para dispositivos informáticos (tabla + importación + CRUD + grilla frontend)
- Fix: foto de perfil sobredimensionada en feed de mantenciones
- Switch Lista/Calendario en agenda: mejora visual con botones pill personalizados
- Redirección al login cuando expire la sesión (AuthGuard + AuthInterceptor + JWT 8h)

### EN REVISIÓN 🔄
- Restricción de acciones de ticket por usuario/rol

### BACKLOG
5. Etiquetar usuarios en comentarios @
6. Función de asignación de tickets
7. Redirección al login cuando expire la sesión
8. Redirigir a detalle al crear ticket
9. Mostrar quién creó el ticket en el listado
10. Funciones completas para "admin"
11. Histórico de acciones del usuario en su perfil
12. Restricción de campos obligatorios al crear ticket
13. Editar información de ticket (con control por rol)
14. Unificación del flujo de acceso a tickets (Hub de Funciones)
15. Barra de búsqueda por términos en "Mis tickets"
16. Generar PDFs de reporte por ticket
17. Mensaje "Sin tickets" si no hay resultados
18. Normalización de tamaño de cards en panel principal
19. Reporte diario de trabajos (turnos día/noche)
20. Horarios de disponibilidad de soporte
23. Dispositivos: considerar programas y sistemas
24. Chat propio del sistema
25. Evaluaciones (3 ítems) para resolución de ticket
26. Solucionadores rápidos para problemas conocidos
27. Configurar como PWA (activación completa)
28. Notificaciones: sencillas y urgentes tipo alarma
29. Registro Histórico de Cumplimiento SLA
30. Cálculo Automático del KPI de Resolución TI
31. Vista Interna de Indicadores KPI
32. Exportación de Reporte KPI (Excel/Tabla)

---

## Pendientes técnicos conocidos

- URL base del backend hardcodeada en servicios — pendiente mover a `environments/*.ts`
- PWA operativa pendiente de activación formal en producción

---

## Notas de desarrollo

- Rama principal de desarrollo: `dev`
- Rama de producción: `main` (solo recibe cambios al lanzar versión)
- Flujo: `feature/nombre` → squash & merge a `dev`
- Archivos sensibles en `.gitignore` (credentials, environments con datos reales)
- Angular actualizado a 20.x (requerido por angular-calendar)
- angular-calendar + date-fns instalados como dependencias

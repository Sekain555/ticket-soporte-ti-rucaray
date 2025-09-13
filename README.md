# 🛠️ Soporte TI - Rucaray

Sistema de **gestión de tickets de soporte técnico** desarrollado con **Angular** e **Ionic**, diseñado para ofrecer una interfaz **web responsiva** que funciona tanto en dispositivos móviles como en escritorio.

![Angular](https://img.shields.io/badge/Angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Ionic](https://img.shields.io/badge/Ionic-%233880FF.svg?style=for-the-badge&logo=ionic&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Sekain555/ticket-soporte-ti-rucaray)

---

## 📚 Tabla de contenidos
- [Características principales](#-características-principales)
- [Tecnologías utilizadas](#-tecnologías-utilizadas)
- [Estructura del proyecto](#-estructura-del-proyecto)
  - [Rutas principales](#rutas-principales)
  - [Servicios core](#servicios-core)
- [Configuración de la API](#-configuración-de-la-api)
- [Instalación y uso](#️-instalación-y-uso)
- [Flujo de usuario](#-flujo-de-usuario)
- [Notas](#-notas)
- [Documentación adicional](#-documentación-adicional)
- [Licencia](#-licencia)

---

## 🚀 Características principales

- 🔑 **Autenticación de usuarios** con gestión de sesiones.
- 📝 **Creación de tickets** con formulario completo: título, descripción, tipo de problema, prioridad y dispositivo afectado.
- 📊 **Panel principal** con navegación intuitiva hacia las funcionalidades principales.
- 📂 **Historial de tickets** para consultar solicitudes previas.
- 📱 **Interfaz responsive** optimizada para múltiples dispositivos.

---

## 🧩 Tecnologías utilizadas

- [Angular](https://angular.io/) – Framework principal para la aplicación SPA.
- [Ionic](https://ionicframework.com/) – UI framework para componentes móviles responsivos.
- [TypeScript](https://www.typescriptlang.org/) – Lenguaje con tipado estático.
- [Angular Router](https://angular.io/guide/router) – Navegación cliente con lazy loading.
- [Angular HttpClient](https://angular.io/guide/http) – Comunicación con API REST.

---

## 📂 Estructura del proyecto

### Rutas principales

| Ruta               | Componente            | Función                                  |
|--------------------|-----------------------|------------------------------------------|
| `/login`           | `LoginPage`           | Autenticación de usuarios                |
| `/panel-principal` | `PanelPrincipalPage`  | Dashboard principal y navegación         |
| `/nuevo-ticket`    | `NuevoTicketPage`     | Creación de nuevos tickets               |
| `/mis-tickets`     | `MisTicketsPage`      | Historial de tickets del usuario         |
| `/detalle-ticket`  | `DetalleTicketPage`   | Detalles específicos de un ticket        |

### Servicios core

- **AuthService** → Gestión de autenticación y sesiones.
- **TicketService** → Operaciones CRUD de tickets con la API backend.

---

## 🔗 Configuración de la API

La aplicación se conecta a una **API REST** local:

```
http://127.0.0.1:8000
```

Todas las operaciones de backend (autenticación, tickets, etc.) se realizan a través de esta API.

> **Sugerencia:** define la URL base de la API en una sola fuente de verdad (por ejemplo `environments/*.ts` o una constante compartida) para facilitar despliegues.

---

## ⚙️️ Instalación y uso

1. **Clona** el repositorio:
   ```bash
   git clone https://github.com/Sekain555/ticket-soporte-ti-rucaray.git
   cd ticket-soporte-ti-rucaray
   ```

2. **Instala** dependencias:
   ```bash
   npm install
   ```

3. **Configura** la URL de la API backend en los servicios (o en `environments`).

4. **Ejecuta** la aplicación en modo desarrollo:
   ```bash
   ionic serve
   ```

> Requisitos sugeridos: Node.js y npm, Ionic CLI y Angular CLI instalados globalmente.

---

## 👨‍💻 Flujo de usuario

1. **Login** → Inicio de sesión con credenciales.
2. **Dashboard** → Acceso al panel principal con navegación.
3. **Crear Ticket** → Completar formulario para nuevas solicitudes de soporte.
4. **Gestionar Tickets** → Visualización y seguimiento de tickets existentes.

---

## 📌 Notas

- El sistema utiliza **autenticación basada en tokens** y validación de sesiones para proteger las rutas.
- Incluye módulos compartidos como `ComponentsModule` para **reutilización de componentes UI**.

---

## 📖 Documentación adicional

- **Wiki del proyecto**  
  - [Overview](https://github.com/Sekain555/ticket-soporte-ti-rucaray/wiki/Overview)  
  - [Ticket Management](https://github.com/Sekain555/ticket-soporte-ti-rucaray/wiki/Ticket-Management)

---

## 📜 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.

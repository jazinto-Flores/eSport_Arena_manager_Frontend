 # 🏆 eSports Arena Manager - Frontend

Aplicación web desarrollada en **React** y **Vite** diseñada para la gestión integral de torneos de eSports, registro e inscripción de equipos, edición de perfiles de jugadores y validación en tiempo real de reglas y sanciones disciplinarias.

---

## 📌 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Ejecución en Desarrollo](#-ejecución-en-desarrollo)
- [Pruebas Unitarias (Testing)](#-pruebas-unitarias-testing)
- [Construcción para Producción](#-construcción-para-producción)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Autor](#-autor)

---

## 🚀 Características Principales

- **Gestión y Tarjetas de Torneos:** Muestra de cupos disponibles, estado del torneo (inscripciones abiertas/cerradas) y requisitos por juego.
- **Formulario de Inscripción Inteligente:** 
  - Validación dinámica de campos obligatorios.
  - Formato de apodo del capitán (3 a 20 caracteres sin espacios).
  - Bloqueo en tiempo real para jugadores con sanciones disciplinarias activas (`JUGADORES_SANCIONADOS`).
  - Verificación de integrantes mínimos según el título del eSport.
- **Perfil de Jugador:** Actualización dinámica de apodos y estado de sanciones.
- **Diseño Responsivo:** Interfaz intuitiva y adaptada a múltiples dispositivos mediante estilos CSS / Bootstrap.

---

## 🛠️ Tecnologías Utilizadas

- **Library/Framework:** [React 18](https://react.dev/)
- **Build Tool:** [Vite v5](https://vitejs.dev/)
- **Testing Framework:** [Vitest](https://vitest.dev/)
- **Testing Utilities:** `@testing-library/react` & `@testing-library/jest-dom`
- **Environment:** `jsdom`
- **Deployment:** [Vercel](https://vercel.com/)

---

## 📋 Requisitos Previos

Asegúrate de contar con los siguientes elementos instalados en tu sistema:

- **Node.js**: `v18.0.0` o superior
- **npm**: `v9.0.0` o superior
- **Git**

---

## 🔧 Instalación y Configuración

1. Clonar el repositorio desde GitHub:
   ```bash
   git clone [https://github.com/jazinto-Flores/eSport_Arena_manager_Frontend.git](https://github.com/jazinto-Flores/eSport_Arena_manager_Frontend.git)

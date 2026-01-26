# MyMentor Playwright Automation 🚀

Este repositorio contiene la suite de pruebas automatizadas para la plataforma **MyMentor**, desarrollada con **Playwright** y siguiendo la arquitectura **KATA** (Komponent Action Test Architecture).

El proyecto está diseñado para garantizar la calidad de los flujos críticos de la plataforma, integrando pruebas de UI (E2E) y de API en un pipeline robusto de CI/CD.

---

## 🏗️ Arquitectura del Proyecto

El framework sigue los estándares de **KATA**, organizando el código en capas modulares para facilitar el mantenimiento y la escalabilidad:

- **`src/core/`**: Infraestructura base del framework.
  - `ui/UiBase.ts`: Clase base para interacciones en el navegador.
  - `api/ApiBase.ts`: Clase base para peticiones HTTP con retorno de tuplas.
  - `TestContext.ts`: Gestor central de Page Objects y contextos.
- **`src/pages/`**: Implementación de **Page Object Models (POM)**. Contiene la lógica de interacción y aserciones de cada página.
- **`tests/`**: Suites de pruebas organizadas por tipo.
  - `e2e/`: Pruebas de flujo completo de usuario (Login, Dashboard).
  - `integration/`: Pruebas de contrato y lógica de API.
  - `fixtures/`: Configuración de extensiones de Playwright para inyectar componentes.

---

## 🛠️ Tecnologías y Herramientas

- **Lenguaje:** TypeScript
- **Motor de Tests:** [Playwright](https://playwright.dev/)
- **Runtime:** [Bun](https://bun.sh/) (Gestión de dependencias y ejecución ultra rápida)
- **Reportes:** [Allure Report](https://allurereport.org/)
- **CI/CD:** GitHub Actions

---

## 🚀 Cómo empezar

### Prerrequisitos
- Tener instalado **Bun** (recomendado) o Node.js.

### Instalación
1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   bun install
   ```
3. Instalar navegadores de Playwright:
   ```bash
   bunx playwright install --with-deps
   ```

### Ejecución de Pruebas
- **Smoke Tests (Críticos):**
  ```bash
  bun run test:smoke
  ```
- **Regression Tests (Suite Completa):**
  ```bash
  bun run test:regression
  ```
- **Pruebas de API:**
  ```bash
  npx playwright test tests/integration
  ```

---

## 📊 Reportes y Monitoreo

### Allure Report (GitHub Pages)
Los reportes se publican automáticamente tras cada ejecución del pipeline y pueden visualizarse en:
👉 **[Reporte de Pruebas en Vivo](https://upex-galaxy.github.io/jlb-MYM-Playwright/)**

### Estrategia de CI/CD
El pipeline de GitHub Actions (`.github/workflows/playwright.yml`) está configurado para:
- **Validación de PRs:** Ejecuta `lint`, `type-check` y `smoke-tests`.
- **Nightly Regression:** Ejecuta la suite completa todas las noches a las 02:00 AM UTC.
- **Evidencia Visual:** Adjunta capturas de pantalla de la "Validación Final" en cada reporte de Allure.

---

## 🎯 Alcance de Automatización (Épica MYM-28)

Actualmente se cubren los siguientes requerimientos de la épica **Session Management**:
- **MYM-29:** Visualización del Dashboard de Sesiones (Pestañas Próximas/Pasadas).
- **MYM-30:** Configuración de Canales de Comunicación para Mentores.
- **Autenticación:** Flujos de Login (Happy Path y Negativos) para Mentores y Mentees.

---

## 👨‍💻 Autor
**JLB - Quality Engineer**
Certificación de Quality Engineer con AI Skills - UPEX Galaxy.

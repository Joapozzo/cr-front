# Testing en Copa Relámpago

Este proyecto utiliza **Vitest** como framework de testing, configurado para trabajar con Next.js y React Testing Library.

## 🚀 Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run test` | Ejecuta los tests en modo observador (watch mode). Ideal para el desarrollo. |
| `npm run test:run` | Ejecuta todos los tests una sola vez. Usado en CI/CD. |
| `npm run test:ui` | Abre la interfaz gráfica de Vitest para explorar tests y logs. |
| `npm run test:coverage` | Genera un reporte de cobertura de código. |

## 🏗️ Estrategia de Testing

Seguimos una estrategia basada en la **Pirámide de Testing**, priorizando tests que aportan mayor valor con el menor costo de mantenimiento.

### 1. Tests Críticos (Prioridad Alta)
Son los que garantizan que la aplicación "no está rota" y que las funciones más sensibles funcionan.
- **Smoke Tests:** Verifican que la app carga (`src/__tests__/smoke.test.tsx`).
- **Auth Tests:** Login, Registro, Persistencia de sesión (`src/app/services/__tests__/auth.services.test.ts`, `src/app/stores/__tests__/authStore.test.ts`).
- **Middleware:** Protección de rutas.

### 2. Tests de Servicios (Prioridad Media/Alta)
Verifican la integración con el backend y la lógica de negocio.
- Se encuentran en `src/app/services/__tests__/`.
- Mockeamos las llamadas HTTP (`axios`/`fetch`) y autenticación (Firebase).

### 3. Tests de Componentes (Prioridad Media)
Verifican componentes complejos de UI.
- Se recomienda colocar el test junto al componente: `MyComponent/__tests__/MyComponent.test.tsx`.
- Usar `testing-library` para testear comportamiento (clics, inputs) y no implementación.

## 📝 Guía para agregar nuevos tests

1. **Ubicación:**
   - Si es un test de integración o global: `src/__tests__/`
   - Si es un test de unidad de un archivo específico: carpeta `__tests__` al lado del archivo.

2. **Convención de nombres:**
   - `*.test.ts` para lógica/servicios.
   - `*.test.tsx` para componentes React.

3. **Herramientas disponibles:**
   - `vi` (de Vitest) para mocking (`vi.fn()`, `vi.mock()`).
   - `render`, `screen`, `fireEvent` (de `@testing-library/react`).
   - Mocks globales ya configurados para `firebase` y `api`.

## ⚡ Mejores Prácticas

- **No testear librerías:** Confiamos en que React, Zustand y Next.js funcionan. Testeamos nuestro código.
- **Mockear bordes:** Mockear API, Firebase, y LocalStorage.
- **Tests determinísticos:** Los tests no deben depender del estado de otros tests o de la red real.

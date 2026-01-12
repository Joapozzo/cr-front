# Estructura Refactorizada - Ficha Médica

## 📁 Organización de Archivos

```
ficha-medica/
├── JugadorFichaMedicaPageContent.tsx  # Componente principal (orquestador)
├── components/                        # Componentes UI
│   ├── BadgeEstado.tsx               # Badge para mostrar estado de ficha
│   ├── InfoField.tsx                 # Campo de información reutilizable
│   ├── EmptyState.tsx                # Estado vacío cuando no hay ficha
│   ├── SkeletonLoader.tsx            # Loading skeleton
│   ├── FichaMedicaDetalle.tsx        # Detalle completo de la ficha
│   ├── AccionesAdmin.tsx             # Botones de acción para admin
│   └── ModalesFichaMedica.tsx        # Contenedor de modales
├── hooks/                             # Hooks personalizados
│   ├── useJugadorId.ts               # Extrae y valida ID del jugador
│   └── useFichaMedicaActions.ts      # Lógica de negocio y acciones
├── helpers/                           # Funciones utilitarias
│   ├── validations.ts                # Validaciones de formularios
│   └── download.ts                   # Lógica de descarga de PDF
└── config/                            # Configuraciones
    └── formFields.ts                 # Definición de campos de formularios
```

## 🎯 Separación de Responsabilidades

### **Componentes (`components/`)**
- **Solo UI**: Renderizan elementos visuales y manejan eventos básicos
- **Props tipadas**: Reciben datos vía props, no hacen fetch
- **Reutilizables**: Pueden usarse en otros contextos

### **Hooks (`hooks/`)**
- **Lógica de datos**: Manejan fetch, mutations, refetch
- **Estado local**: Gestionan estado de UI (modales, loading)
- **Orquestación**: Coordinan llamadas a servicios y actualizaciones

### **Helpers (`helpers/`)**
- **Funciones puras**: Sin efectos secundarios
- **Validaciones**: Lógica de validación reutilizable
- **Utilidades**: Funciones auxiliares (descarga, formateo)

### **Config (`config/`)**
- **Configuración estática**: Definiciones de formularios, opciones
- **Sin lógica**: Solo datos estructurados

## 🔄 Flujo de Datos

```
JugadorFichaMedicaPageContent (Orquestador)
    ↓
useFichaMedicaActions (Hook de negocio)
    ↓
├── useFichaMedicaJugador (Hook de datos)
├── useSubirFichaMedicaAdmin (Hook de mutación)
└── useCambiarEstadoFichaMedica (Hook de mutación)
    ↓
fichaMedicaService (Servicio API)
    ↓
API Backend
```

## 📦 Componentes Principales

### `JugadorFichaMedicaPageContent`
- **Rol**: Orquestador principal
- **Responsabilidades**:
  - Componer la UI usando subcomponentes
  - Pasar props a componentes hijos
  - Manejar permisos (isAdmin)

### `useFichaMedicaActions`
- **Rol**: Hook de negocio
- **Responsabilidades**:
  - Gestionar estado de modales
  - Coordinar mutaciones
  - Validar datos antes de enviar
  - Manejar callbacks de éxito/error

### `BadgeEstado`
- **Rol**: Componente atómico
- **Props**: `fichaMedica: FichaMedica | null`
- **Responsabilidad**: Mostrar badge con estado visual

### `FichaMedicaDetalle`
- **Rol**: Componente compuesto
- **Props**: `fichaMedica: FichaMedica`
- **Responsabilidad**: Renderizar todos los campos de la ficha

### `AccionesAdmin`
- **Rol**: Componente de acción
- **Props**: Callbacks y estados de loading
- **Responsabilidad**: Botones de acción para admin

## 🎨 Principios Aplicados

1. **Single Responsibility**: Cada componente/hook tiene una única responsabilidad
2. **DRY (Don't Repeat Yourself)**: Lógica reutilizable en helpers
3. **Composition over Inheritance**: Componentes pequeños que se combinan
4. **Separation of Concerns**: UI, lógica y datos separados
5. **Type Safety**: TypeScript estricto en todos los archivos

## 🚀 Beneficios

- ✅ **Mantenibilidad**: Fácil encontrar y modificar código
- ✅ **Testabilidad**: Componentes y funciones aisladas
- ✅ **Reutilización**: Componentes atómicos reutilizables
- ✅ **Legibilidad**: Código más claro y organizado
- ✅ **Escalabilidad**: Fácil agregar nuevas features


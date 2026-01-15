# Refactorización de SelfieForm

## 📁 Estructura de Archivos

```
selfie/
├── hooks/
│   ├── useSelfieState.ts          # Estado general del formulario
│   ├── useCamera.ts               # Lógica de cámara y dispositivos
│   ├── useFaceDetection.ts        # Detección facial y captura
│   └── useSelfieUpload.ts         # Subida y validación de selfies
├── components/
│   ├── TipsPopover.tsx            # Popover de tips/requisitos
│   ├── CaptureGuide.tsx           # Guía inicial con icono
│   ├── CaptureCounter.tsx         # Contador de captura
│   ├── CameraOverlay.tsx          # Overlay de cámara con guía
│   ├── SelfieInitialView.tsx     # Vista inicial (subir foto)
│   ├── SelfieCaptureView.tsx     # Vista de captura con cámara
│   └── SelfiePreviewView.tsx     # Vista de preview y confirmación
└── README.md                      # Este archivo
```

## 🎯 Responsabilidades por Archivo

### Hooks (Lógica)

#### `useSelfieState.ts`
**Responsabilidad:** Manejo de estado general del formulario
- Modo actual (`inicial | capturando | preview`)
- Preview y base64 del selfie
- Estados de loading y mensajes
- Validación de rostro
- Tips popover
- Detección de mobile
- Estado de login
- Persistencia en localStorage

**NO contiene:** Lógica de cámara, detección facial, o subida

---

#### `useCamera.ts`
**Responsabilidad:** Toda la lógica relacionada con la cámara
- Stream de MediaStream
- Lista de cámaras disponibles
- Cámara seleccionada
- Refs de video e input file
- Iniciar/detener stream
- Manejo de permisos y errores

**NO contiene:** Detección facial, validación, o subida

---

#### `useFaceDetection.ts`
**Responsabilidad:** Detección facial y captura automática
- Carga de modelos face-api
- Detección en tiempo real
- Contador de captura automática
- Validación de rostro
- Captura de foto desde video
- Compresión de imagen

**NO contiene:** Manejo de cámara (solo usa el videoRef), subida, o navegación

---

#### `useSelfieUpload.ts`
**Responsabilidad:** Subida y validación de selfies
- Carga de archivo desde input
- Validación de imagen y rostro
- Compresión
- Subida al servidor
- Login automático después de subir
- Redirección al home
- Limpieza de datos

**NO contiene:** Lógica de cámara o detección facial

---

### Componentes Presentacionales (UI)

#### `TipsPopover.tsx`
**Responsabilidad:** Mostrar tips/requisitos de la foto
- Botón de toggle
- Popover con lista de requisitos
- 100% presentacional, solo props

---

#### `CaptureGuide.tsx`
**Responsabilidad:** Guía inicial con icono
- Muestra icono ScanFace o spinner
- Mensaje de guía o loading
- 100% presentacional

---

#### `CaptureCounter.tsx`
**Responsabilidad:** Contador de captura
- Muestra número grande cuando hay contador activo
- Diferentes tamaños para mobile/desktop
- 100% presentacional

---

#### `CameraOverlay.tsx`
**Responsabilidad:** Overlay de la cámara
- Guía oval con estado de detección
- Integra CaptureCounter
- Mensajes de estado
- 100% presentacional

---

#### `SelfieInitialView.tsx`
**Responsabilidad:** Vista inicial completa
- TipsPopover
- CaptureGuide
- Botón de subir foto
- Input file oculto
- 100% presentacional

---

#### `SelfieCaptureView.tsx`
**Responsabilidad:** Vista de captura completa
- Indicador de carga
- TipsPopover
- Video con overlay
- Controles de captura
- Botones de acción
- 100% presentacional

---

#### `SelfiePreviewView.tsx`
**Responsabilidad:** Vista de preview completa
- Indicador de carga
- Preview de imagen
- Badge de "Foto lista"
- Botones de confirmar/reiniciar
- 100% presentacional

---

## 🔄 Flujo de Datos

```
SelfieForm (Orquestador)
    ↓
    ├─→ useSelfieState (estado general)
    ├─→ useCamera (stream, dispositivos)
    ├─→ useFaceDetection (detección, captura)
    └─→ useSelfieUpload (subida, validación)
         ↓
    Renderiza componentes presentacionales según modo
```

## ✅ Garantías de la Refactorización

1. **Comportamiento idéntico:** Toda la lógica se mantiene exactamente igual
2. **UI idéntica:** Todos los componentes renderizan la misma UI
3. **Flujos preservados:** Todos los flujos async, efectos y validaciones se mantienen
4. **Separación clara:** Cada hook tiene una sola responsabilidad
5. **Testeable:** Cada hook y componente puede testearse independientemente
6. **Reutilizable:** La lógica de cámara/detección puede usarse en otros flujos

## 🚨 Notas Importantes

- **NO se cambió ninguna lógica funcional**
- **NO se cambiaron textos ni clases CSS**
- **NO se optimizó nada "porque sí"**
- **El resultado se comporta EXACTAMENTE igual que antes**

## 📝 Uso

El componente `SelfieForm` se usa exactamente igual que antes:

```tsx
<SelfieForm onLoadingChange={(loading) => {}} />
```

La refactorización es transparente para el consumidor.


# Modelos de Face Detection

Esta carpeta debe contener los modelos de face-api.js para la detección facial.

## Descargar Modelos

Descarga los siguientes archivos desde el repositorio oficial:
https://github.com/justadudewhohacks/face-api.js-models/tree/master/models

### Archivos Requeridos:

**Carpeta: `tiny_face_detector_model-weights_manifest.json`**
- tiny_face_detector_model-weights_manifest.json
- tiny_face_detector_model-shard1

**Carpeta: `face_landmark_68_model-weights_manifest.json`**
- face_landmark_68_model-weights_manifest.json
- face_landmark_68_model-shard1

**Carpeta: `face_expression_model-weights_manifest.json`**
- face_expression_model-weights_manifest.json
- face_expression_model-shard1

## Estructura Final

```
public/
└── models/
    ├── README.md (este archivo)
    ├── tiny_face_detector_model-weights_manifest.json
    ├── tiny_face_detector_model-shard1
    ├── face_landmark_68_model-weights_manifest.json
    ├── face_landmark_68_model-shard1
    ├── face_expression_model-weights_manifest.json
    └── face_expression_model-shard1
```

## Comando Rápido (con curl)

```bash
cd public/models

# Tiny Face Detector
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector/tiny_face_detector_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector/tiny_face_detector_model-shard1

# Face Landmarks
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68/face_landmark_68_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68/face_landmark_68_model-shard1

# Face Expression
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_expression/face_expression_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_expression/face_expression_model-shard1
```

## Alternativa (con wget)

```bash
cd public/models

# Tiny Face Detector
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector/tiny_face_detector_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector/tiny_face_detector_model-shard1

# Face Landmarks
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68/face_landmark_68_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68/face_landmark_68_model-shard1

# Face Expression
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_expression/face_expression_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_expression/face_expression_model-shard1
```

Una vez descargados, la detección facial funcionará automáticamente.


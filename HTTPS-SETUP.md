# 🔒 Configuración HTTPS para Desarrollo

Esta guía te ayudará a configurar HTTPS en tu entorno de desarrollo para poder usar la cámara desde tu celular.

## 📋 Prerequisitos

Necesitas instalar `mkcert`, una herramienta para crear certificados SSL locales confiables.

### Instalación de mkcert

#### Windows

**🚀 Opción Más Rápida: Script Automático**

Ejecuta este comando en PowerShell:
```powershell
cd cr-front
powershell -ExecutionPolicy Bypass -File install-mkcert.ps1
```

El script descargará e instalará mkcert automáticamente.

---

**🎯 Opción Manual: Descarga Manual**

1. Ve a: https://github.com/FiloSottile/mkcert/releases/latest
2. Descarga `mkcert-v*-windows-amd64.exe` (la versión más reciente)
3. Renombra el archivo descargado a `mkcert.exe`
4. Colócalo en una carpeta (ejemplo: `C:\tools\mkcert\`)
5. Agrega esa carpeta a tu PATH:
   - Presiona `Win + X` y selecciona "Sistema"
   - Haz clic en "Configuración avanzada del sistema"
   - Haz clic en "Variables de entorno"
   - En "Variables del sistema", busca "Path" y haz clic en "Editar"
   - Haz clic en "Nuevo" y agrega la ruta donde colocaste mkcert.exe (ejemplo: `C:\tools\mkcert\`)
   - Haz clic en "Aceptar" en todas las ventanas
   - **Cierra y vuelve a abrir PowerShell/CMD** para que tome efecto

**Opciones Alternativas:**

```powershell
# Opción 1: Con Chocolatey (requiere PowerShell como Administrador)
# 1. Abre PowerShell como Administrador (clic derecho → "Ejecutar como administrador")
# 2. Si hay un archivo de bloqueo, elimínalo primero:
Remove-Item "C:\ProgramData\chocolatey\lib\960379d0c075d4e5840fa9c2c120a75d9b2885d5" -Force -ErrorAction SilentlyContinue
# 3. Luego instala:
choco install mkcert

# Opción 2: Con Scoop (requiere instalar Scoop primero)
scoop install mkcert
```

#### macOS
```bash
brew install mkcert
```

#### Linux
```bash
# Descargar desde releases de GitHub
# O usar el gestor de paquetes de tu distribución
```

## 🚀 Configuración

### Paso 1: Crear Autoridad Certificadora Local

Ejecuta este comando **una sola vez** (instala una autoridad certificadora en tu sistema):

```bash
mkcert -install
```

> **Nota:** En Windows, es posible que necesites ejecutar PowerShell o CMD como Administrador.

### Paso 2: Generar Certificados SSL

Crea la carpeta para los certificados y genera los certificados:

```bash
# Crear carpeta
mkdir certificates

# Generar certificados solo para localhost
mkcert -key-file certificates/localhost-key.pem -cert-file certificates/localhost.pem localhost 127.0.0.1 ::1
```

### Paso 3: Obtener tu IP Local (Para acceso desde celular)

Para poder acceder desde tu celular, necesitas tu IP local:

**Windows:**
```bash
ipconfig
# Busca "Dirección IPv4" en la sección de tu adaptador WiFi/Ethernet
# Ejemplo: 192.168.1.100
```

**macOS/Linux:**
```bash
ifconfig
# O
ip addr show
# Busca la IP en tu adaptador WiFi/Ethernet (inet)
```

### Paso 4: Generar Certificados con tu IP Local

Una vez que tengas tu IP local, genera los certificados incluyéndola:

```bash
# Reemplaza 192.168.1.100 con tu IP local
mkcert -key-file certificates/localhost-key.pem -cert-file certificates/localhost.pem localhost 127.0.0.1 ::1 192.168.1.100
```

> **Importante:** Si cambias de red WiFi o tu IP cambia, necesitarás regenerar los certificados.

## 🎯 Uso

### Desarrollo Normal (HTTP)
```bash
npm run dev
```

### Desarrollo con HTTPS
```bash
npm run dev:https
```

El servidor estará disponible en:
- **Desde tu computadora:** `https://localhost:3000`
- **Desde tu celular:** `https://TU_IP_LOCAL:3000` (ejemplo: `https://192.168.1.100:3000`)

## 📱 Acceso desde el Celular

1. **Conecta tu celular a la misma red WiFi** que tu computadora
2. **Abre tu navegador** en el celular
3. **Ve a** `https://TU_IP_LOCAL:3000` (reemplaza con tu IP local)
4. **Acepta el certificado** cuando tu navegador te lo solicite (es seguro porque lo generaste tú)
5. **¡Listo!** Ahora puedes usar la cámara desde tu celular

### Solución de Problemas

#### El navegador dice que el certificado no es confiable
- Asegúrate de haber ejecutado `mkcert -install`
- En Android, es posible que necesites instalar el certificado manualmente
- En iOS, acepta el certificado en Ajustes > General > Acerca del dispositivo > Certificados de confianza

#### No puedo acceder desde el celular
- Verifica que ambos dispositivos estén en la misma red WiFi
- Asegúrate de que tu firewall no esté bloqueando el puerto 3000
- Verifica que tu IP local sea correcta (puede cambiar si te conectas a otra red)

#### Error "certificados no encontrados"
- Verifica que la carpeta `certificates/` existe
- Verifica que los archivos `localhost-key.pem` y `localhost.pem` están en esa carpeta
- Regenera los certificados siguiendo el Paso 2 y Paso 4

## 🔐 Seguridad

- Los certificados generados son solo para desarrollo local
- **NO** subas la carpeta `certificates/` a tu repositorio (ya está en .gitignore)
- Los certificados funcionan solo en tu red local
- Para producción, usa certificados SSL reales (Let's Encrypt, etc.)

## 📝 Notas Adicionales

- Si cambias de red WiFi, necesitarás regenerar los certificados con tu nueva IP
- Puedes generar múltiples certificados para diferentes IPs si lo necesitas
- El puerto por defecto es 3000, pero puedes cambiarlo usando la variable de entorno `PORT`


const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');
const os = require('os');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Función para obtener todas las IPs locales
function getAllLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Ignorar direcciones internas (localhost) y no IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

// Rutas de los certificados SSL
const certPath = path.join(__dirname, 'certificates');
const keyPath = path.join(certPath, 'localhost-key.pem');
const certFilePath = path.join(certPath, 'localhost.pem');

// Verificar que los certificados existan
if (!fs.existsSync(keyPath) || !fs.existsSync(certFilePath)) {
  console.error('\n❌ ERROR: No se encontraron los certificados SSL.\n');
  ('📋 Para generar los certificados, sigue estos pasos:\n');
  ('1. Instala mkcert:');
  ('   - Windows (con Chocolatey): choco install mkcert');
  ('   - Windows (con Scoop): scoop install mkcert');
  ('   - macOS: brew install mkcert');
  ('   - Linux: Ver instrucciones en https://github.com/FiloSottile/mkcert\n');
  ('2. Crea una autoridad certificadora local:');
  ('   mkcert -install\n');
  ('3. Genera los certificados para localhost:');
  ('   mkdir certificates');
  (`   mkcert -key-file certificates/localhost-key.pem -cert-file certificates/localhost.pem localhost 127.0.0.1 ::1`);
  ('\n   Para acceder desde tu celular, también genera con tu IP local:');
  ('   mkcert -key-file certificates/localhost-key.pem -cert-file certificates/localhost.pem localhost 127.0.0.1 ::1 TU_IP_LOCAL');
  ('   (Reemplaza TU_IP_LOCAL con tu IP, ejemplo: 192.168.1.100)\n');
  process.exit(1);
}

const app = next({ dev, hostname, port: port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certFilePath),
  };

  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, '0.0.0.0', (err) => {
    if (err) throw err;
    const localIPs = getAllLocalIPs();
    (`\n✅ Servidor HTTPS iniciado en:`);
    (`   - https://localhost:${port}`);
    (`   - https://127.0.0.1:${port}`);
    if (localIPs.length > 0) {
      localIPs.forEach(ip => {
        (`   - https://${ip}:${port}`);
      });
      ('\n📱 Para acceder desde tu celular:');
      (`   1. Asegúrate de que tu celular esté en la misma red WiFi`);
      // Priorizar IPs que empiezan con 192. o 10. (redes locales comunes)
      const preferredIP = localIPs.find(ip => ip.startsWith('192.') || ip.startsWith('10.')) || localIPs[0];
      (`   2. Accede desde tu celular a: https://${preferredIP}:${port}`);
      if (localIPs.length > 1) {
        (`   (También puedes probar con: ${localIPs.filter(ip => ip !== preferredIP).join(', ')})`);
      }
      (`   3. Acepta el certificado cuando tu navegador te lo solicite\n`);
    } else {
      ('\n📱 Para acceder desde tu celular:');
      ('   1. Asegúrate de que tu celular esté en la misma red WiFi');
      ('   2. Encuentra tu IP local (ejecuta: ipconfig en Windows)');
      ('   3. Accede desde tu celular a: https://TU_IP_LOCAL:3000');
      ('   4. Acepta el certificado cuando tu navegador te lo solicite\n');
    }
  });
});


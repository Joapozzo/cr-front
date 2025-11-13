'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { MdQrCodeScanner, MdCameraswitch } from 'react-icons/md';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ScannerDNIProps {
  onScan: (codigo: string) => void;
  isScanning: boolean;
  setIsScanning: (value: boolean) => void;
}

export const ScannerDNI = ({ onScan, isScanning, setIsScanning }: ScannerDNIProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState('');
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');

  useEffect(() => {
    const loadCameras = async () => {
      try {
        // 1. Forzar permisos de cámara primero
        await navigator.mediaDevices.getUserMedia({ video: true });

        // 2. AÑADIR UN PEQUEÑO RETRASO (Ej: 100ms)
        // Esto da tiempo al sistema operativo para listar los dispositivos reales.
        await new Promise(resolve => setTimeout(resolve, 100)); // 👈 NUEVO

        const devices = await Html5Qrcode.getCameras();

        if (devices && devices.length) {
          setCameras(
            devices.map((device) => ({
              id: device.id,
              label: device.label || `Cámara ${device.id}`,
            }))
          );

          // Seleccionar cámara trasera por defecto
          const backCamera = devices.find((d) =>
            d.label.toLowerCase().includes('back') ||
            d.label.toLowerCase().includes('trasera') ||
            d.label.toLowerCase().includes('environment')
          );
          setSelectedCamera(backCamera?.id || devices[0].id);
        } else {
          setError('No se detectaron cámaras');
        }
      } catch (err: any) {
        console.error('Error al obtener cámaras:', err);
        setError('Error al acceder a las cámaras. Verifica los permisos.');
      }
    };

    loadCameras();
  }, []);

  useEffect(() => {
    if (!isScanning || !selectedCamera) return;

    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        await scanner.start(
          selectedCamera, // ← USAR ID DE CÁMARA
          {
            fps: 10,
            qrbox: { width: 300, height: 150 },
            // CAMBIO: USAR STRINGS EN LUGAR DE Html5Qrcode.BarcodeFormat
            formatsToSupport: [
              'QR_CODE',
              'CODE_128',
              'PDF_417', // ¡Esto sigue siendo CLAVE para el DNI!
            ],
          },
          (decodedText) => {
            console.log("📸 Código detectado:", decodedText);
            const stopScanner = async () => {
              try {
                console.log("🛑 Deteniendo scanner...");
                await scanner.stop();
                console.log("🧹 Limpiando...");
                await scanner.clear();
                console.log("✅ Scanner detenido y limpio");
                scannerRef.current = null;
                // Esperar a que React termine de desmontar el componente
                setIsScanning(false);

                // 🔥 Cambiar: ejecutar el onScan en el siguiente tick
                setTimeout(() => onScan(decodedText), 50);
              } catch (err) {
                console.error("Error al detener el escáner:", err);
              }
            };
            stopScanner();
          },
          (errorMessage) => {
            // Evita spam: sólo mostrar errores críticos una vez
            if (
              errorMessage?.includes('NotFoundError') ||
              errorMessage?.includes('NotReadableError') ||
              errorMessage?.includes('PermissionDeniedError') ||
              errorMessage?.includes('camera') ||
              errorMessage?.includes('device')
            ) {
              if (!error) {
                setError('Error al acceder a la cámara.');
                toast.error('Error al acceder a la cámara. Verifica permisos.');
              }
            }
            // No mostrar toasts repetitivos por "no se detectó código"
          }
        );
      } catch (err: any) {
        console.log(err);
        setError('Error al iniciar cámara. Verifica los permisos.');
        setIsScanning(false);
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .finally(() => (scannerRef.current = null))
          .catch((err) => console.error("Error al detener scanner:", err));
      }
    };

  }, [isScanning, selectedCamera, onScan, setIsScanning]); // ← AGREGAR selectedCamera

  // NUEVO: Cambiar cámara
  const handleCameraChange = async (cameraId: string) => {
    if (scannerRef.current) {
      await scannerRef.current.stop();
    }
    setSelectedCamera(cameraId);
    setIsScanning(true);
  };

  if (!isScanning) {
    return (
      <div
        onClick={() => setIsScanning(true)}
        className="w-full h-64 bg-[var(--gray-400)] rounded-lg border-2 border-dashed border-[var(--gray-300)] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[var(--gray-300)] transition-all"
      >
        <MdQrCodeScanner size={48} className="text-[var(--gray-200)]" />
        <p className="text-sm text-[var(--gray-200)]">
          Click para escanear el código de barras
        </p>
        <p className="text-xs text-[var(--gray-300)]">
          Enfoca el código del frente de tu DNI
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {/* NUEVO: Selector de cámaras */}
      {cameras.length > 1 && (
        <div className="flex items-center gap-2">
          <MdCameraswitch size={20} className="text-[var(--gray-200)]" />
          <select
            value={selectedCamera}
            onChange={(e) => handleCameraChange(e.target.value)}
            className="flex-1 bg-[var(--gray-400)] text-white rounded-lg px-3 py-2 text-sm outline-none border border-[var(--gray-300)] focus:border-[var(--green)]"
          >
            {cameras.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {cameras.length === 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-[var(--gray-200)]">
            No se detectaron cámaras físicas. Sube una foto del código de barras.
          </p>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // Procesar imagen subida
                Html5Qrcode.scanFile(file, true)
                  .then(onScan)
                  .catch(() => toast.error('No se pudo leer el código'));
              }
            }}
            className="hidden"
            id="upload-dni"
          />
          <label
            htmlFor="upload-dni"
            className="w-full py-3 bg-[var(--green)] text-[var(--black)] rounded-lg text-center cursor-pointer hover:opacity-90"
          >
            Subir foto del DNI
          </label>
        </div>
      )}

      <div id="qr-reader" className="w-full rounded-lg overflow-hidden" />

      {error && (
        <p className="text-xs text-[var(--red)] text-center">{error}</p>
      )}

      <div className="flex items-center justify-center gap-2 text-[var(--green)]">
        <Loader2 className="w-4 h-4 animate-spin" />
        <p className="text-sm">Escaneando código de barras...</p>
      </div>

      <button
        onClick={() => setIsScanning(false)}
        className="text-sm text-[var(--gray-200)] hover:text-[var(--red)] transition-colors"
      >
        Cancelar
      </button>
    </div>
  );
};
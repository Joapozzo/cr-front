'use client';

import { useScannerDNI } from '../../hooks/useScannerDNI';
import { ScannerIdleView, ScannerActiveView } from './ScannerDNIComponents';
import { ImageCropper } from './ImageCropper';

interface ScannerDNIProps {
  onScan: (codigo: string) => void;
  onPhotoScan?: (imagenBase64: string) => void;
  isScanning: boolean;
  setIsScanning: (value: boolean) => void;
}

export const ScannerDNI = ({ onScan, onPhotoScan, isScanning, setIsScanning }: ScannerDNIProps) => {
  const {
    fileInputGalleryRef,
    fileInputCameraRef,
    error,
    isRequestingPermission,
    showPhotoButton,
    isProcessingPhoto,
    imageToCrop,
    showCropper,
    handlePhotoSelected,
    handleOpenGallery,
    handleOpenCamera,
    handleStartScanning,
    handleRetry,
    handleCropComplete,
    handleCropCancel,
    isSecureContext,
    isMediaDevicesAvailable,
  } = useScannerDNI({
    isScanning,
    setIsScanning,
    onScan,
    onPhotoScan,
  });

  // Mostrar cropper si hay imagen para recortar
  if (showCropper && imageToCrop) {
    return (
      <ImageCropper
        image={imageToCrop}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
      />
    );
  }

  if (!isScanning) {
    return (
      <ScannerIdleView
        error={error}
        onStartScanning={handleStartScanning}
        onRetry={handleRetry}
        onOpenGallery={handleOpenGallery}
        onOpenCamera={handleOpenCamera}
        onPhotoSelected={handlePhotoSelected}
        onPhotoScan={onPhotoScan}
        fileInputGalleryRef={fileInputGalleryRef}
        fileInputCameraRef={fileInputCameraRef}
        isSecureContext={isSecureContext}
        isMediaDevicesAvailable={isMediaDevicesAvailable}
      />
    );
  }

  return (
    <ScannerActiveView
      isRequestingPermission={isRequestingPermission}
      isProcessingPhoto={isProcessingPhoto}
      error={error}
      showPhotoButton={showPhotoButton}
      onOpenGallery={handleOpenGallery}
      onOpenCamera={handleOpenCamera}
      onPhotoSelected={handlePhotoSelected}
      onPhotoScan={onPhotoScan}
      onCancel={() => setIsScanning(false)}
      fileInputGalleryRef={fileInputGalleryRef}
      fileInputCameraRef={fileInputCameraRef}
    />
  );
};
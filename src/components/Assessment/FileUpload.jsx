import React, { useRef, useState } from 'react';
import { UploadCloud, Image, Camera, FileCheck } from 'lucide-react';
import { decodeQrFromImage } from '../../utils/qrParser.js';

export default function FileUpload({ onFileProcessed, onOpenCamera, onError }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file) => {
    if (!file) return;

    // Validate image MIME type or file extension
    const isImageMime = file.type.startsWith('image/');
    const isImageExt = /\.(png|jpe?g|webp|bmp|gif|svg|heic|avif)$/i.test(file.name);

    if (!isImageMime && !isImageExt) {
      onError('Please upload a valid image file (PNG, JPG, JPEG, WEBP, BMP, SVG, HEIC).');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      try {
        const img = new window.Image();
        img.src = dataUrl;
        img.onload = async () => {
          const rawQr = await decodeQrFromImage(img);
          onFileProcessed(dataUrl, rawQr);
        };
        img.onerror = () => {
          onFileProcessed(dataUrl, null);
        };
      } catch (_) {
        onFileProcessed(dataUrl, null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  // Drag and drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  return (
    <div className="space-y-3 font-sans">
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*,.png,.jpg,.jpeg,.webp,.bmp,.gif,.svg,.heic,.avif" 
        className="hidden" 
        onChange={handleFileChange} 
      />

      {/* Drag & Drop Card with Visual Highlight */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`card p-7 sm:p-8 bg-white dark:bg-surface-900 border-2 border-dashed transition-all cursor-pointer text-center group active:scale-[0.99] shadow-sm
          ${isDragging 
            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 ring-4 ring-brand-500/20 scale-[1.01]' 
            : 'border-brand-300 dark:border-brand-800 hover:border-brand-500 dark:hover:border-brand-600'}`}
      >
        <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-3xl flex items-center justify-center mx-auto mb-3 border transition-transform shadow-inner
          ${isDragging 
            ? 'bg-brand-500 text-white border-brand-400 scale-110' 
            : 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800 group-hover:scale-110'}`}
        >
          {isDragging ? (
            <FileCheck className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.2] animate-bounce" />
          ) : (
            <UploadCloud className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.2]" />
          )}
        </div>

        <h3 className="font-display font-bold text-surface-900 dark:text-white text-base mb-1">
          {isDragging ? 'Drop Image to Scan' : 'Upload FitMao Slip or QR Photo'}
        </h3>
        <p className="text-xs text-surface-500 dark:text-surface-400 max-w-xs mx-auto mb-3.5 leading-relaxed">
          Drag & drop, paste from clipboard (Ctrl+V), or browse any image format (PNG, JPG, WEBP, HEIC, SVG).
        </p>

        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-white rounded-xl text-xs font-display font-bold shadow-sm group-hover:bg-brand-600 transition-colors">
          <Image className="w-4 h-4" /> Browse Image Files
        </span>
      </div>

      {/* Live Camera Scanner Button */}
      <button
        type="button"
        onClick={onOpenCamera}
        className="w-full py-3 px-4 bg-brand-100 dark:bg-brand-950/50 hover:bg-brand-100 dark:hover:bg-brand-800/60 text-brand-700 dark:text-brand-200 border border-brand-200 dark:border-brand-700 rounded-2xl text-xs font-display font-extrabold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
      >
        <Camera className="w-4 h-4 text-brand-500 dark:text-brand-400" />
        <span>Open Live Camera Viewfinder (Scan QR Directly)</span>
      </button>
    </div>
  );
}

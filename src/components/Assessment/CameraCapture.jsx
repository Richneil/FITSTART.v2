import React, { useRef, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { decodeQrFromImage } from '../../utils/qrParser.js';

export default function CameraCapture({ onCapture, onClose, onError }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let active = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        if (!active) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        if (active) {
          onError('Camera access unavailable. Please check camera permissions or upload an image slip instead.');
          onClose();
        }
      }
    }

    startCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [onError, onClose]);

  const handleSnap = async () => {
    if (!videoRef.current) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');

      const rawQr = await decodeQrFromImage(canvas);
      onCapture(dataUrl, rawQr);
    } catch (_) {
      onCapture(null, null);
    }
  };

  return (
    <div className="card p-4 sm:p-5 bg-black border-2 border-brand-500 rounded-3xl shadow-2xl relative overflow-hidden animate-fade-in text-center font-sans">
      <div className="relative w-full aspect-[4/3] bg-surface-950 rounded-2xl overflow-hidden flex items-center justify-center border border-brand-900/60 shadow-inner">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Animated Green Laser Scanning Reticle */}
        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 aspect-square max-w-[220px] max-h-[220px] mx-auto border-2 border-brand-400/80 rounded-2xl pointer-events-none flex flex-col justify-between p-2 shadow-[0_0_15px_rgba(47,115,101,0.5)]">
          <div className="flex justify-between">
            <span className="w-4 h-4 border-t-2 border-l-2 border-brand-300 rounded-tl-sm"></span>
            <span className="w-4 h-4 border-t-2 border-r-2 border-brand-300 rounded-tr-sm"></span>
          </div>
          {/* Laser Line */}
          <div className="w-full h-0.5 bg-brand-400 shadow-[0_0_8px_#34d399] animate-scan-line"></div>
          <div className="flex justify-between">
            <span className="w-4 h-4 border-b-2 border-l-2 border-brand-300 rounded-bl-sm"></span>
            <span className="w-4 h-4 border-b-2 border-r-2 border-brand-300 rounded-br-sm"></span>
          </div>
        </div>

        <div className="absolute bottom-2 inset-x-0 text-center">
          <span className="text-[10px] font-display font-bold text-white/90 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
            Align FitMao QR Code or Assessment Slip in Frame
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <button
          type="button"
          onClick={handleSnap}
          className="btn-primary flex-1 py-3 text-xs font-display font-bold flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
        >
          <Camera className="w-4 h-4" /> Snap & Decode FitMao Scan
        </button>

        <button
          type="button"
          onClick={onClose}
          className="px-4 py-3 bg-surface-800 hover:bg-surface-700 text-surface-200 border border-surface-700 rounded-2xl text-xs font-display font-bold transition-colors cursor-pointer flex items-center gap-1"
        >
          <X className="w-4 h-4" /> Close
        </button>
      </div>
    </div>
  );
}

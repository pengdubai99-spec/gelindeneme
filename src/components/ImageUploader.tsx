import React, { useState, useRef } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadFile } from "../services/falApi";

interface Props {
  label: string;
  onUpload: (url: string) => void;
  isLoading?: boolean;
}

export const ImageUploader: React.FC<Props> = ({ label, onUpload, isLoading = false }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    try {
      setLocalLoading(true);
      const url = URL.createObjectURL(file);
      setPreview(url);

      const falUrl = await uploadFile(file);
      onUpload(falUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert("İşlem sırasında hata! Lütfen tekrar deneyin.");
      setPreview(null);
    } finally {
      setLocalLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onUpload("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col w-full">
      <motion.div
        whileHover={!preview ? { scale: 1.01 } : {}}
        className={`aspect-[4/5] glass-panel rounded-xl border-dashed border-2 flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden relative
          ${preview ? 'border-none shadow-2xl' : 'border-white/10 hover:border-[#D4AF37]/40 hover:bg-white/[0.02]'}
          ${isDragging ? '!border-[#D4AF37]/60 !bg-[#D4AF37]/[0.05] scale-[1.02]' : ''}
        `}
        onClick={() => !localLoading && !isLoading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          accept="image/*"
          onChange={onFileChange}
          disabled={localLoading || isLoading}
        />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="absolute inset-0 z-10 p-0"
            >
              <img
                src={preview}
                alt="Önizleme"
                className="w-full h-full object-cover"
              />
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 50, 50, 0.8)' }}
                whileTap={{ scale: 0.9 }}
                onClick={removeImage}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 border border-white/20 z-20"
              >
                <X size={16} />
              </motion.button>

              {localLoading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                  <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mb-4" />
                  <span className="text-[10px] text-[#D4AF37] font-bold tracking-[0.3em] uppercase">Hazırlanıyor</span>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="z-10 text-center p-6 flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <p className="text-sm font-medium mb-1 text-white/80">Kaynak Seç</p>
              <p className="text-xs text-gray-500 italic">veya sürükle-bırak</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 opacity-10 bg-gradient-to-t from-[#D4AF37] to-transparent pointer-events-none"></div>
      </motion.div>
    </div>
  );
};

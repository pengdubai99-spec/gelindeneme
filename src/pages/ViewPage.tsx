import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageUploader } from "../components/ImageUploader";
import { AIModelId, ViewMode, BodyShape, BoneStructure } from "../services/falApi";
import { Play, ArrowRight, Sparkles } from "lucide-react";

interface ViewPageProps {
  title: string;
  subtitle: string;
  accentColor: string;
  viewMode: ViewMode;
  onDressUrlChange: (url: string) => void;
  onModelUrlChange: (url: string) => void;
  onLocationUrlChange?: (url: string) => void;
  isLoading: boolean;
  onGenerate: () => void;
  canGenerate: boolean;
  progressMsg: string;
  height: string;
  weight: string;
  onHeightChange: (val: string) => void;
  onWeightChange: (val: string) => void;
  bodyShape: BodyShape | "";
  boneStructure: BoneStructure | "";
  onBodyShapeChange: (val: BodyShape | "") => void;
  onBoneStructureChange: (val: BoneStructure | "") => void;
}

const BODY_SHAPES: { id: BodyShape; label: string; tr: string; svg: React.ReactNode }[] = [
  {
    id: "apple",
    label: "Apple",
    tr: "Elma",
    svg: (
      <svg viewBox="0 0 40 70" className="w-7 h-12" fill="currentColor">
        <ellipse cx="20" cy="18" rx="9" ry="10" opacity="0.9"/>
        <ellipse cx="20" cy="40" rx="13" ry="14" />
        <rect x="16" y="52" width="4" height="12" rx="2"/>
        <rect x="22" y="52" width="4" height="12" rx="2"/>
      </svg>
    ),
  },
  {
    id: "pear",
    label: "Pear",
    tr: "Armut",
    svg: (
      <svg viewBox="0 0 40 70" className="w-7 h-12" fill="currentColor">
        <ellipse cx="20" cy="18" rx="8" ry="9" opacity="0.9"/>
        <ellipse cx="20" cy="38" rx="8" ry="9" />
        <ellipse cx="20" cy="53" rx="13" ry="10" />
        <rect x="16" y="60" width="3.5" height="8" rx="2"/>
        <rect x="22" y="60" width="3.5" height="8" rx="2"/>
      </svg>
    ),
  },
  {
    id: "hourglass",
    label: "Hourglass",
    tr: "Kum Saati",
    svg: (
      <svg viewBox="0 0 40 70" className="w-7 h-12" fill="currentColor">
        <ellipse cx="20" cy="17" rx="12" ry="10" opacity="0.9"/>
        <path d="M8 27 Q20 38 32 27 L32 43 Q20 32 8 43 Z" />
        <ellipse cx="20" cy="53" rx="12" ry="10" />
        <rect x="16" y="60" width="3.5" height="8" rx="2"/>
        <rect x="22" y="60" width="3.5" height="8" rx="2"/>
      </svg>
    ),
  },
  {
    id: "rectangle",
    label: "Rectangle",
    tr: "Dikdörtgen",
    svg: (
      <svg viewBox="0 0 40 70" className="w-7 h-12" fill="currentColor">
        <ellipse cx="20" cy="17" rx="9" ry="9" opacity="0.9"/>
        <rect x="11" y="26" width="18" height="30" rx="4" />
        <rect x="15" y="54" width="4" height="12" rx="2"/>
        <rect x="22" y="54" width="4" height="12" rx="2"/>
      </svg>
    ),
  },
  {
    id: "inverted-triangle",
    label: "Inverted Triangle",
    tr: "Ters Üçgen",
    svg: (
      <svg viewBox="0 0 40 70" className="w-7 h-12" fill="currentColor">
        <ellipse cx="20" cy="17" rx="9" ry="9" opacity="0.9"/>
        <path d="M7 26 L33 26 L26 56 L14 56 Z" />
        <rect x="15" y="54" width="4" height="12" rx="2"/>
        <rect x="22" y="54" width="4" height="12" rx="2"/>
      </svg>
    ),
  },
];

const BONE_STRUCTURES: { id: BoneStructure; label: string }[] = [
  { id: "small", label: "İnce Kemik" },
  { id: "medium", label: "Orta Kemik" },
  { id: "large", label: "İri Kemik" },
];

export const ViewPage: React.FC<ViewPageProps> = ({
  title,
  subtitle,
  accentColor,
  viewMode,
  onDressUrlChange,
  onModelUrlChange,
  onLocationUrlChange,
  isLoading,
  onGenerate,
  canGenerate,
  progressMsg,
  height,
  weight,
  onHeightChange,
  onWeightChange,
  bodyShape,
  boneStructure,
  onBodyShapeChange,
  onBoneStructureChange,
}) => {
  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Top Title Bar */}
      <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
        <div className="flex-1">
          <h2 className="text-2xl sm:text-4xl font-serif text-white tracking-tight">{title}</h2>
          <p className="text-[10px] sm:text-sm text-[#D4AF37]/80 font-light mt-1 sm:mt-2 flex items-center">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            {subtitle} Modu Aktif
          </p>
        </div>

        <button
          onClick={onGenerate}
          disabled={isLoading || !canGenerate}
          className={`w-full sm:w-auto bg-[#D4AF37] hover:bg-[#A67C00] text-black px-6 sm:px-10 py-3 sm:py-4 rounded-full flex items-center justify-center space-x-3 transition-all transform hover:scale-105 shadow-xl shadow-[#D4AF37]/20 font-bold group disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed shrink-0`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <Play size={16} fill="currentColor" strokeWidth={0} />
          )}
          <span className="text-[11px] sm:text-sm uppercase tracking-widest">{isLoading ? 'Üretiliyor...' : 'Üretimi Başlat'}</span>
          {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
        </button>
      </div>

      {/* Upload Zones Grid */}
      <div className={`grid grid-cols-1 ${viewMode.includes('location') ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-4 sm:gap-8 mb-6 sm:mb-10`}>
        {/* Slot 1: Tasarım Girişi */}
        <div className="flex flex-col">
          <label className="text-[9px] sm:text-[11px] uppercase tracking-widest text-gray-400 mb-2 sm:mb-4 font-semibold flex justify-between px-1">
            <span>Tasarım Girişi</span>
            <span className="text-[#D4AF37]/60 italic font-normal">Referans</span>
          </label>
          <ImageUploader label="Giysi Referansı" onUpload={onDressUrlChange} isLoading={isLoading} />
        </div>

        {/* Slot 2: Müşteri Girişi */}
        <div className="flex flex-col">
          <label className="text-[9px] sm:text-[11px] uppercase tracking-widest text-gray-400 mb-2 sm:mb-4 font-semibold flex justify-between px-1">
            <span>Müşteri Girişi</span>
            <span className="text-[#D4AF37]/60 italic font-normal">Kullanıcı</span>
          </label>
          <ImageUploader label="Müşteri Görseli" onUpload={onModelUrlChange} isLoading={isLoading} />

          {/* Boy & Kilo */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold ml-1">Boy (cm)</label>
              <input
                type="number"
                placeholder="175"
                value={height}
                onChange={(e) => onHeightChange(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#D4AF37]/50 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold ml-1">Kilo (kg)</label>
              <input
                type="number"
                placeholder="65"
                value={weight}
                onChange={(e) => onWeightChange(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#D4AF37]/50 outline-none transition-all"
              />
            </div>
          </div>

          {/* Vücut Şekli */}
          <div className="mt-4 space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold ml-1">Vücut Şekli</label>
            <div className="grid grid-cols-5 gap-1.5">
              {BODY_SHAPES.map((shape) => (
                <button
                  key={shape.id}
                  type="button"
                  onClick={() => onBodyShapeChange(bodyShape === shape.id ? "" : shape.id)}
                  className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border transition-all ${
                    bodyShape === shape.id
                      ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                      : "border-white/10 bg-black/30 text-gray-500 hover:border-white/20 hover:text-gray-300"
                  }`}
                >
                  {shape.svg}
                  <span className="text-[8px] font-bold uppercase tracking-wide leading-tight text-center">{shape.tr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Kemik Yapısı */}
          <div className="mt-3 space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold ml-1">Kemik Yapısı</label>
            <div className="grid grid-cols-3 gap-2">
              {BONE_STRUCTURES.map((bone) => (
                <button
                  key={bone.id}
                  type="button"
                  onClick={() => onBoneStructureChange(boneStructure === bone.id ? "" : bone.id)}
                  className={`py-2 rounded-xl border text-[9px] font-bold uppercase tracking-widest transition-all ${
                    boneStructure === bone.id
                      ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                      : "border-white/10 bg-black/30 text-gray-500 hover:border-white/20 hover:text-gray-300"
                  }`}
                >
                  {bone.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Slot 3: Mekan Girişi (Optional) */}
        {(viewMode === "location" || viewMode === "location-closeup") && (
          <div className="flex flex-col">
            <label className="text-[9px] sm:text-[11px] uppercase tracking-widest text-gray-400 mb-2 sm:mb-4 font-semibold flex justify-between px-1">
              <span>Mekan Girişi</span>
              <span className="text-[#D4AF37]/60 italic font-normal">Sahne</span>
            </label>
            <ImageUploader label="Mekan Fotoğrafı" onUpload={onLocationUrlChange!} isLoading={isLoading} />
          </div>
        )}
      </div>

      {/* Live Log Overlay */}
      <div className="glass-panel rounded-lg p-4 sm:p-5 font-mono text-[8px] sm:text-[10px] text-gray-500 border-l-2 border-l-[#D4AF37] bg-black/40 mb-8 sm:mb-0">
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-3">
          <span className={isLoading ? "text-yellow-500 animate-pulse" : "text-green-500 font-bold"}>
            {isLoading ? "● İŞLENİYOR" : "● SİSTEM HAZIR"}
          </span>
          <span className="hidden xs:inline">SUNUCU: OPTIMAL</span>
          <span className="text-[#D4AF37] font-bold">MOD: {viewMode.toUpperCase()}</span>
        </div>
        <div className="space-y-1 opacity-60 overflow-hidden">
          <div className="truncate">DÜĞÜM: {isLoading ? "COMPUTE_ACTIVE" : "IDLE"}</div>
          {isLoading ? (
            <div className="text-white/80 animate-pulse">{progressMsg}</div>
          ) : (
            <div className="truncate">GD_{new Date().getTime().toString().slice(-8)}_SESSION_WAITING...</div>
          )}
        </div>
      </div>
    </div>
  );
};

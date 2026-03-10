import React, { useState } from "react";
import { Download, Maximize2, X, Clock, ExternalLink, Zap, History, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GenerationResult {
  id: string;
  url: string;
  timestamp: string;
  engine: string;
  seed: number;
  viewMode?: string;
}

interface Props {
  results: GenerationResult[];
  isLoading?: boolean;
}

export const ResultGallery: React.FC<Props> = ({ results, isLoading }) => {
  const [selectedImage, setSelectedImage] = useState<GenerationResult | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Origin': window.location.origin
        }
      });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.warn("CORS download failed, opening in new tab instead", error);
      window.open(url, '_blank');
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
            <History size={11} className="text-[#D4AF37]/60" />
          </div>
          <h3 className="font-display text-xs font-bold text-white/30 uppercase tracking-[0.15em]">Arşiv</h3>
          
          {results.length > 0 && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => downloadImage(results[0].url, `fashionmaster-latest-${results[0].id}.png`)}
              className="ml-2 p-1.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all"
              title="Son Çalışmayı İndir"
            >
              <Download size={12} />
            </motion.button>
          )}
        </div>
        <motion.div
          key={results.length}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-[8px] font-bold text-white/10 tracking-widest bg-white/[0.03] px-2 py-1 rounded-lg border border-white/[0.04]"
        >
          {results.length} ÇIKTI
        </motion.div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 gap-5 overflow-y-auto pr-1 scroll-area flex-1">
        <AnimatePresence mode="popLayout">
          {/* Empty State */}
          {results.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-4 py-16"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
                <LayoutGrid size={28} className="text-white/8" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-[10px] font-bold text-white/12 uppercase tracking-[0.4em]">Henüz Sonuç Yok</p>
                <p className="text-[9px] text-white/6 font-medium">Üretim başlatıldığında sonuçlar burada görünecek</p>
              </div>
            </motion.div>
          )}

          {/* Result Cards */}
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.08, type: "spring", damping: 20 }}
              className="relative group cursor-pointer"
              onClick={() => setSelectedImage(result)}
            >
              <div className="card-glass relative aspect-[3/4] overflow-hidden bg-[#050508] group-hover:border-[#D4AF37]/15 transition-all duration-700">
                {/* Image */}
                <img
                  src={result.url}
                  alt="Üretim"
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-[1.03]"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end p-6 gap-4">
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); setSelectedImage(result); }}
                      className="w-11 h-11 bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                      <Maximize2 size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); downloadImage(result.url, `fashionmaster-${result.id}.png`); }}
                      className="w-11 h-11 bg-[#D4AF37]/20 backdrop-blur-xl rounded-xl border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/30 transition-colors"
                    >
                      <Download size={18} />
                    </motion.button>
                  </div>
                </div>

                {/* Corner badge */}
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="px-2 py-1 bg-black/60 backdrop-blur-xl rounded-lg border border-white/10">
                    <span className="text-[8px] font-bold text-white/60 uppercase tracking-wider">{result.engine}</span>
                  </div>
                </div>
              </div>

              {/* Meta Info */}
              <div className="mt-3 px-1 flex justify-between items-center">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <Clock size={8} className="text-white/10" />
                    <span className="text-[8px] text-white/12 font-bold tracking-wider uppercase">{result.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap size={7} className="text-[#D4AF37]/50" fill="currentColor" />
                    <span className="text-[7px] font-bold text-[#D4AF37]/40 tracking-wider uppercase">{result.viewMode === 'back' ? 'Arka' : result.viewMode === 'closeup' ? 'Detay' : result.viewMode === 'location' ? 'Mekan' : result.viewMode === 'location-closeup' ? 'Dış Yakın' : 'Ön'} Çekim</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); downloadImage(result.url, `fashionmaster-${result.id}.png`); }}
                  className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all duration-300"
                  title="Hızlı İndir"
                >
                  <Download size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}

          {/* Loading Skeleton */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-glass border-dashed border-white/[0.06] overflow-hidden"
            >
              <div className="aspect-[3/4] bg-[#050508] flex flex-col items-center justify-center relative">
                {/* Animated scanning line */}
                <motion.div
                  animate={{ y: [-200, 200] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"
                />
                <div className="z-10 flex flex-col items-center gap-6">
                  <motion.div
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Zap size={20} className="text-[#D4AF37]/40" />
                  </motion.div>
                  <span className="text-[9px] text-white/15 font-bold tracking-[0.4em] uppercase">Sentezleniyor</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Fullscreen Modal ─── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/95 z-[99999] flex items-center justify-center p-8 md:p-20 backdrop-blur-2xl"
            onClick={() => { setSelectedImage(null); setIsZoomed(false); }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedImage(null)}
                className="absolute -top-14 right-0 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-white/30 hover:text-white transition-all z-50"
              >
                <X size={22} strokeWidth={1.5} />
              </motion.button>

              {/* Image Container */}
              <div 
                className="relative w-full flex justify-center bg-black/30 p-3 border border-white/[0.04] backdrop-blur-xl rounded-3xl overflow-hidden cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
              >
                <div className="absolute inset-0 bg-[#D4AF37]/3 blur-[80px] pointer-events-none" />
                <motion.img
                  layout
                  src={selectedImage.url}
                  alt="Tam Ekran"
                  animate={{ scale: isZoomed ? 2 : 1 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className={`object-contain rounded-2xl shadow-2xl relative z-10 ${isZoomed ? "max-h-[150vh] cursor-zoom-out" : "max-h-[72vh] cursor-zoom-in"}`}
                />
              </div>

              {/* Meta Bar */}
              <div className="w-full max-w-2xl mt-10 p-8 card-glass flex flex-wrap justify-between items-center gap-8">
                <div className="flex items-center gap-12">
                  <div className="space-y-2">
                    <p className="text-[#D4AF37]/60 text-[9px] font-bold uppercase tracking-[0.3em]">Düğüm</p>
                    <p className="text-white/80 font-bold text-sm tracking-widest uppercase">{selectedImage.engine}</p>
                  </div>
                  <div className="w-[1px] h-8 bg-white/[0.06]" />
                  <div className="space-y-2">
                    <p className="text-[#D4AF37]/60 text-[9px] font-bold uppercase tracking-[0.3em]">Seed</p>
                    <p className="text-white/60 font-mono text-sm tracking-tight">{selectedImage.seed}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsZoomed(!isZoomed)}
                    className={`flex items-center gap-2 text-xs py-3 px-6 rounded-xl border transition-all ${
                      isZoomed 
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37]/40 text-[#D4AF37]' 
                        : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.06] text-white/60 hover:text-white'
                    }`}
                  >
                    <Maximize2 size={16} />
                    {isZoomed ? "Uzaklaştır" : "Yakın Plan"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => downloadImage(selectedImage.url, `fashionmaster-${selectedImage.id}.png`)}
                    className="btn-primary text-xs py-3 px-6"
                  >
                    İndir
                  </motion.button>
                  <a
                    href={selectedImage.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-white/30 hover:text-white transition-all"
                  >
                    <ExternalLink size={18} strokeWidth={1.5} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

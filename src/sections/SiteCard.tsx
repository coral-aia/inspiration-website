import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Heart, ExternalLink } from "lucide-react";
import type { Site } from "@/types/site";

interface SiteCardProps {
  site: Site;
  onEdit: (site: Site) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  index: number;
}

export default function SiteCard({ site, onEdit, onDelete, onToggleFavorite, index }: SiteCardProps) {
  const [imgError, setImgError] = useState(false);
  const handleClickUrl = () => { if (site.url) window.open(site.url, "_blank"); };
  const imgSrc = site.screenshotBase64 && (site.screenshotBase64.startsWith("data:") || site.screenshotBase64.startsWith("http")) ? site.screenshotBase64 : null;
  const pressed = "inset -2px -2px 4px rgba(255,255,255,0.7), inset 2px 2px 4px rgba(174,174,192,0.25)";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      onClick={handleClickUrl}
      className="group rounded-3xl overflow-hidden relative cursor-pointer"
      style={{ background: "#F0F0F3", boxShadow: "-4px -4px 8px #FFFFFF, 4px 4px 8px rgba(174,174,192,0.4)" }}
    >
      <div className="w-full aspect-video relative overflow-hidden" style={{ background: "#E8E8EC" }}>
        {imgSrc && !imgError ? (
          <img src={imgSrc} alt={site.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={() => setImgError(true)} loading="lazy" referrerPolicy="no-referrer" crossOrigin="anonymous" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center" style={{ color: "#A0A0B0" }}>
            <ExternalLink className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs opacity-70">{site.name}</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-base font-semibold mb-1 truncate" style={{ color: "#728AB7" }}>{site.name}</h3>
        <p className="text-sm leading-relaxed mb-3 line-clamp-2 min-h-[2.5em]" style={{ color: "#808B9F" }}>{site.description || "暂无介绍"}</p>

        <div className="flex items-center justify-between">
          <span className="inline-block text-xs font-medium px-3 py-1.5 rounded-2xl" style={{ background: "#F0F0F3", boxShadow: "-2px -2px 4px #FFFFFF, 2px 2px 4px rgba(174,174,192,0.3)", color: "#745FF2" }}>
            {site.category || "未分类"}
          </span>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(site.id); }}
            className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer transition-all"
            style={{ background: "#F0F0F3", boxShadow: site.isFavorite ? pressed : "-2px -2px 4px #FFFFFF, 2px 2px 4px rgba(174,174,192,0.3)" }}
          >
            <Heart className="w-4 h-4" style={{ color: site.isFavorite ? "#FB7575" : "#C4C4CF" }} fill={site.isFavorite ? "#FB7575" : "none"} />
          </motion.button>
        </div>
      </div>

      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <motion.button whileTap={{ scale: 0.85 }} onClick={(e) => { e.stopPropagation(); onEdit(site); }} className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer" style={{ background: "#F0F0F3", boxShadow: "-2px -2px 4px #FFFFFF, 2px 2px 4px rgba(174,174,192,0.4)" }}>
          <Pencil className="w-3.5 h-3.5" style={{ color: "#728AB7" }} />
        </motion.button>
        <motion.button whileTap={{ scale: 0.85 }} onClick={(e) => { e.stopPropagation(); if (confirm("确定删除这个网站吗？")) onDelete(site.id); }} className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer" style={{ background: "#F0F0F3", boxShadow: "-2px -2px 4px #FFFFFF, 2px 2px 4px rgba(174,174,192,0.4)" }}>
          <Trash2 className="w-3.5 h-3.5" style={{ color: "#FB7575" }} />
        </motion.button>
      </div>
    </motion.div>
  );
}

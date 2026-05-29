import { motion, AnimatePresence } from 'framer-motion';
import { Layers } from 'lucide-react';
import type { Site } from '@/types/site';
import SiteCard from './SiteCard';

interface SiteCardGridProps {
  sites: Site[];
  onEdit: (site: Site) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

export default function SiteCardGrid({ sites, onEdit, onDelete, onToggleFavorite }: SiteCardGridProps) {
  if (sites.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: '#F0F0F3', boxShadow: '-4px -4px 8px #FFFFFF, 4px 4px 8px rgba(174,174,192,0.4)' }}>
          <Layers className="w-8 h-8" style={{ color: '#C4C4CF' }} />
        </div>
        <p className="text-lg mb-2" style={{ color: '#94A3B8' }}>还没有收藏的网站</p>
        <p className="text-sm" style={{ color: '#A0A0B0' }}>点击上方「添加新网站」开始记录你的灵感吧</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <AnimatePresence mode="popLayout">
        {sites.map((site, index) => (
          <SiteCard key={site.id} site={site} onEdit={onEdit} onDelete={onDelete} onToggleFavorite={onToggleFavorite} index={index} />
        ))}
      </AnimatePresence>
    </div>
  );
}

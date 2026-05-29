import { motion } from 'framer-motion';
import { Search, Plus, Download } from 'lucide-react';

interface ToolbarProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  onSearch: (keyword: string) => void;
  onAdd: () => void;
  onExport: () => void;
}

export default function Toolbar({ categories, activeCategory, onCategoryChange, onSearch, onAdd, onExport }: ToolbarProps) {
  const pressed = { background: '#EEEEEE', boxShadow: 'inset -2px -2px 4px rgba(255,255,255,0.7), inset 2px 2px 4px rgba(174,174,192,0.25)' };

  const FilterBtn = ({ cat, active }: { cat: string; active: boolean }) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => onCategoryChange(cat)}
      className="px-4 py-1.5 rounded-2xl text-sm font-medium cursor-pointer transition-all duration-200 border-none whitespace-nowrap"
      style={active
        ? { ...pressed, color: '#745FF2' }
        : { background: '#F0F0F3', boxShadow: '-3px -3px 6px #FFFFFF, 3px 3px 6px rgba(174,174,192,0.4)', color: '#808B9F' }
      }
    >
      {cat === 'all' ? '全部' : cat}
    </motion.button>
  );

  return (
    <div className="rounded-3xl px-4 py-3 flex flex-col md:flex-row md:items-center gap-3 md:gap-0 md:justify-between" style={{ background: '#F0F0F3', boxShadow: '-4px -4px 8px #FFFFFF, 4px 4px 8px rgba(174,174,192,0.4)' }}>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <FilterBtn cat="all" active={activeCategory === 'all'} />
        {categories.map((cat) => <FilterBtn key={cat} cat={cat} active={activeCategory === cat} />)}
      </div>

      {/* Right Side: Search + Add + Export */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
          <input onChange={(e) => onSearch(e.target.value)} placeholder="搜索..." className="nue-input pl-9 pr-4 py-2 text-sm w-40 md:w-48" />
        </div>

        {/* Add Button */}
        <motion.button
          whileHover={{ y: -1, boxShadow: '-5px -5px 10px #FFFFFF, 5px 5px 10px rgba(174,174,192,0.5)' }}
          whileTap={{ scale: 0.92, boxShadow: 'inset -2px -2px 4px rgba(255,255,255,0.7), inset 2px 2px 4px rgba(174,174,192,0.25)' }}
          onClick={onAdd}
          className="flex items-center gap-1 px-3 py-2 rounded-2xl text-xs font-medium cursor-pointer border-none transition-all"
          style={{ background: '#F0F0F3', boxShadow: '-3px -3px 6px #FFFFFF, 3px 3px 6px rgba(174,174,192,0.4)', color: '#745FF2' }}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>添加</span>
        </motion.button>

        {/* Export Button */}
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.92, boxShadow: 'inset -2px -2px 4px rgba(255,255,255,0.7), inset 2px 2px 4px rgba(174,174,192,0.25)' }}
          onClick={onExport}
          className="flex items-center gap-1 px-3 py-2 rounded-2xl text-xs font-medium cursor-pointer border-none transition-all"
          style={{ background: '#F0F0F3', boxShadow: '-3px -3px 6px #FFFFFF, 3px 3px 6px rgba(174,174,192,0.4)', color: '#808B9F' }}
        >
          <Download className="w-3.5 h-3.5" />
          <span>导出</span>
        </motion.button>
      </div>
    </div>
  );
}

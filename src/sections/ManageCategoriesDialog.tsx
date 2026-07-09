import { useState, useMemo } from 'react';
import { X, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ManageCategoriesDialogProps {
  open: boolean;
  onClose: () => void;
  categories: string[];
  siteCounts: Record<string, number>;
  onRename: (oldName: string, newName: string) => void;
  onDelete: (category: string, moveTo?: string) => void;
}

type Mode = 'list' | 'rename' | 'delete';

export default function ManageCategoriesDialog({ open, onClose, categories, siteCounts, onRename, onDelete }: ManageCategoriesDialogProps) {
  const [mode, setMode] = useState<Mode>('list');
  const [selectedCat, setSelectedCat] = useState('');
  const [newName, setNewName] = useState('');
  const [moveTarget, setMoveTarget] = useState('');
  const [error, setError] = useState('');

  const otherCategories = useMemo(() => categories.filter((c) => c !== selectedCat), [categories, selectedCat]);

  const reset = () => { setMode('list'); setSelectedCat(''); setNewName(''); setMoveTarget(''); setError(''); };

  const handleClose = () => { reset(); onClose(); };

  const startRename = (cat: string) => { setSelectedCat(cat); setNewName(cat); setMode('rename'); setError(''); };

  const startDelete = (cat: string) => {
    setSelectedCat(cat);
    setMoveTarget('');
    setMode('delete');
    setError('');
  };

  const confirmRename = () => {
    const trimmed = newName.trim();
    if (!trimmed) { setError('请输入分类名称'); return; }
    if (trimmed === selectedCat) { setError('名称没有变化'); return; }
    if (categories.includes(trimmed)) { setError('该分类名称已存在'); return; }
    onRename(selectedCat, trimmed);
    reset();
  };

  const confirmDelete = () => {
    onDelete(selectedCat, moveTarget || undefined);
    reset();
  };

  const elevated = { background: '#F0F0F3', boxShadow: '-3px -3px 6px #FFFFFF, 3px 3px 6px rgba(174,174,192,0.4)' };
  const pressed = { background: '#EEEEEE', boxShadow: 'inset -2px -2px 4px rgba(255,255,255,0.7), inset 2px 2px 4px rgba(174,174,192,0.25)' };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="sm:max-w-md rounded-3xl border-none p-0 overflow-hidden" style={{ background: '#F0F0F3', boxShadow: '-10px -10px 24px #FFFFFF, 10px 10px 24px rgba(174, 174, 192, 0.45)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-lg font-semibold" style={{ color: '#728AB7' }}>
            {mode === 'list' && '📁 管理分类'}
            {mode === 'rename' && '✏️ 重命名分类'}
            {mode === 'delete' && '🗑️ 删除分类'}
          </h2>
          <button onClick={handleClose} className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer" style={elevated}>
            <X className="w-4 h-4" style={{ color: '#808B9F' }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          {/* === LIST MODE === */}
          {mode === 'list' && (
            <div className="space-y-2 max-h-[320px] overflow-y-auto">
              {categories.length === 0 ? (
                <div className="text-center py-8 text-sm" style={{ color: '#94A3B8' }}>暂无分类</div>
              ) : (
                categories.map((cat) => (
                  <div key={cat} className="flex items-center justify-between px-4 py-3 rounded-2xl" style={pressed}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium truncate" style={{ color: '#728AB7' }}>{cat}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: '#F0F0F3', boxShadow: '-1px -1px 2px #FFFFFF, 1px 1px 2px rgba(174,174,192,0.3)', color: '#808B9F' }}>
                        {siteCounts[cat] || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => startRename(cat)} className="w-7 h-7 rounded-full flex items-center justify-center border-none cursor-pointer" style={elevated}>
                        <Pencil className="w-3 h-3" style={{ color: '#728AB7' }} />
                      </button>
                      <button onClick={() => startDelete(cat)} className="w-7 h-7 rounded-full flex items-center justify-center border-none cursor-pointer" style={elevated}>
                        <Trash2 className="w-3 h-3" style={{ color: '#FB7575' }} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* === RENAME MODE === */}
          {mode === 'rename' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: '#808B9F' }}>原名称</label>
                <div className="px-4 py-2.5 rounded-xl text-sm" style={{ ...pressed, color: '#94A3B8' }}>{selectedCat}</div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: '#728AB7' }}>新名称</label>
                <input value={newName} onChange={(e) => { setNewName(e.target.value); setError(''); }} placeholder="输入新分类名称" className="nue-input px-4 py-2.5 text-sm w-full" autoFocus />
              </div>
              {error && <p className="text-xs" style={{ color: '#FB7575' }}>{error}</p>}
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={reset} className="nue-btn px-4 py-2 text-xs font-medium" style={{ color: '#808B9F' }}>取消</button>
                <button onClick={confirmRename} className="nue-btn px-5 py-2 text-xs font-semibold" style={{ color: '#745FF2' }}>确认</button>
              </div>
            </div>
          )}

          {/* === DELETE MODE === */}
          {mode === 'delete' && (
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-1" style={{ color: '#808B9F' }}>要删除的分类</p>
                <div className="px-4 py-2.5 rounded-xl text-sm font-medium" style={{ ...pressed, color: '#FB7575' }}>{selectedCat}</div>
              </div>

              {(siteCounts[selectedCat] || 0) > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4" style={{ color: '#FB7575' }} />
                    <p className="text-sm" style={{ color: '#FB7575' }}>该分类下还有 {siteCounts[selectedCat]} 个网站</p>
                  </div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: '#728AB7' }}>转移到</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="moveTarget" value="" checked={moveTarget === ''} onChange={() => setMoveTarget('')} className="accent-[#745FF2]" />
                      <span className="text-sm" style={{ color: '#475569' }}>设为"未分类"</span>
                    </label>
                    {otherCategories.map((cat) => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="moveTarget" value={cat} checked={moveTarget === cat} onChange={() => setMoveTarget(cat)} className="accent-[#745FF2]" />
                        <span className="text-sm" style={{ color: '#475569' }}>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {(siteCounts[selectedCat] || 0) === 0 && (
                <p className="text-sm" style={{ color: '#94A3B8' }}>该分类下没有网站，删除后筛选列表中将不再显示。</p>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button onClick={reset} className="nue-btn px-4 py-2 text-xs font-medium" style={{ color: '#808B9F' }}>取消</button>
                <button onClick={confirmDelete} className="nue-btn px-5 py-2 text-xs font-semibold" style={{ color: '#FB7575' }}>确认删除</button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

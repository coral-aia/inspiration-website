import { useState, useRef, useEffect } from 'react';
import { ImagePlus, Globe, Loader2, Wand2 } from 'lucide-react';
import type { Site } from '@/types/site';

interface AddSiteFormProps {
  editingSite: Site | null;
  existingCategories: string[];
  onSave: (site: Omit<Site, 'id' | 'createdAt'>, screenshotFile?: File | null) => void;
  onCancel: () => void;
}

interface FetchResult {
  title: string;
  description: string;
}

async function fetchSiteMeta(url: string): Promise<FetchResult | null> {
  try {
    const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&meta=true`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.data) return null;
    return {
      title: data.data.title || '',
      description: data.data.description || '',
    };
  } catch {
    return null;
  }
}

export default function AddSiteForm({ editingSite, existingCategories, onSave, onCancel }: AddSiteFormProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingSite) {
      setName(editingSite.name);
      setUrl(editingSite.url);
      setDescription(editingSite.description);
      setCategory(editingSite.category);
      setPreviewUrl(editingSite.screenshotBase64 || '');
      setScreenshotFile(null);
      setFetchError('');
    } else {
      setName(''); setUrl(''); setDescription(''); setCategory('');
      setPreviewUrl(''); setScreenshotFile(null); setFetchError('');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [editingSite]);

  // Auto-fetch title/description when URL is entered
  useEffect(() => {
    if (editingSite) return;
    if (!url.trim()) return;
    if (!/^https?:\/\//i.test(url)) return;

    const timer = setTimeout(async () => {
      setIsFetching(true);
      setFetchError('');
      const info = await fetchSiteMeta(url.trim());
      if (info) {
        setName((prev) => prev || info.title || '');
        setDescription((prev) => prev || info.description || '');
      }
      setIsFetching(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [url, editingSite]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setScreenshotFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(editingSite?.screenshotBase64 || '');
    }
  };

  const handleManualFetch = async () => {
    if (!url.trim()) return;
    if (!/^https?:\/\//i.test(url)) { setFetchError('网址格式不正确'); return; }
    setIsFetching(true);
    setFetchError('');
    const info = await fetchSiteMeta(url.trim());
    if (info) {
      setName(info.title || name);
      setDescription(info.description || description);
    } else {
      setFetchError('抓取失败，请手动填写');
    }
    setIsFetching(false);
  };

  const handleSubmit = () => {
    if (!name.trim() || !url.trim()) { alert('请填写网站名称和网址'); return; }
    if (!/^https?:\/\//i.test(url)) { alert('网址必须以 http:// 或 https:// 开头'); return; }
    if (!category.trim()) { alert('请填写分类'); return; }
    onSave(
      {
        name: name.trim(),
        url: url.trim(),
        description: description.trim(),
        category: category.trim(),
        screenshotBase64: previewUrl,
        isFavorite: editingSite?.isFavorite || false,
      },
      screenshotFile
    );
  };

  return (
    <div className="space-y-4 pt-2">
      {/* URL */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" style={{ color: '#728AB7' }}>网址 <span style={{ color: '#FB7575' }}>*</span></label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="nue-input pl-9 pr-4 py-2.5 text-sm w-full"
              disabled={!!editingSite}
            />
          </div>
          {!editingSite && (
            <button
              onClick={handleManualFetch}
              disabled={isFetching || !url.trim()}
              className="nue-btn flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-medium cursor-pointer border-none transition-all disabled:opacity-50"
              style={{ color: '#745FF2' }}
            >
              {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              <span>抓取</span>
            </button>
          )}
        </div>
        {fetchError && <p className="text-xs" style={{ color: '#FB7575' }}>{fetchError}</p>}
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" style={{ color: '#728AB7' }}>网站名称 <span style={{ color: '#FB7575' }}>*</span></label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="例：Pinterest" className="nue-input px-4 py-2.5 text-sm" />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" style={{ color: '#728AB7' }}>一句话介绍</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="简短描述这个网站的用途" rows={2} className="nue-input px-4 py-2.5 text-sm resize-y" />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" style={{ color: '#728AB7' }}>分类 <span style={{ color: '#FB7575' }}>*</span></label>
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="例：设计资源 / AI工具" list="categoryOptions" className="nue-input px-4 py-2.5 text-sm" />
        <datalist id="categoryOptions">{existingCategories.map((cat) => <option key={cat} value={cat} />)}</datalist>
      </div>

      {/* Screenshot Upload */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" style={{ color: '#728AB7' }}>截图</label>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="nue-btn flex items-center gap-1.5 px-4 py-2 text-sm font-medium cursor-pointer" style={{ color: '#728AB7' }}>
            <ImagePlus className="w-4 h-4" /> 选择图片
          </button>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="w-[160px] h-[96px] object-cover rounded-xl" style={{ boxShadow: 'inset -2px -2px 4px rgba(255,255,255,0.7), inset 2px 2px 4px rgba(174,174,192,0.25)' }} />
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <button onClick={onCancel} className="nue-btn px-5 py-2 text-sm font-medium cursor-pointer" style={{ color: '#808B9F' }}>取消</button>
        <button onClick={handleSubmit} className="nue-btn px-6 py-2 text-sm font-semibold cursor-pointer" style={{ color: '#745FF2' }}>
          {editingSite ? '更新' : '保存'}
        </button>
      </div>
    </div>
  );
}

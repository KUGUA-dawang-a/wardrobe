/**
 * 上传表单组件
 *
 * 拖拽/点击上传图片，选择分类/颜色/季节/风格等标签。
 */

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { CATEGORY_OPTIONS, COLOR_OPTIONS, SEASON_OPTIONS, STYLE_OPTIONS, Season, Style, ClothingCategory, ClothingColor } from '../types';

interface UploadFormProps {
  onUpload: (data: {
    name: string;
    category: ClothingCategory;
    color: ClothingColor;
    season: Season[];
    style: Style[];
    image: File;
  }) => Promise<void>;
}

const inputClass =
  'w-full bg-surface text-ink rounded-lg px-3 py-2 text-sm border border-border focus:border-primary focus:ring-2 focus:ring-primary-soft outline-none';

export function UploadForm({ onUpload }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClothingCategory | ''>('');
  const [color, setColor] = useState<ClothingColor | ''>('');
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(f.type)) {
      setError('只支持 JPG/PNG/GIF/WebP 格式');
      return;
    }
    setError('');
    setFile(f);
    setPreview(URL.createObjectURL(f));
    if (!name) setName(f.name.replace(/\.[^.]+$/, ''));
  }, [name]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: () => setError('文件太大（最大 5MB）或不支持的类型'),
  });

  const toggleSeason = (s: Season) => {
    setSeasons(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const toggleStyle = (s: Style) => {
    setStyles(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleSubmit = async () => {
    if (!file || !name || !category || !color || seasons.length === 0 || styles.length === 0) {
      setError('请填写完整信息');
      return;
    }
    setUploading(true);
    setError('');
    try {
      await onUpload({ name, category: category as ClothingCategory, color: color as ClothingColor, season: seasons, style: styles, image: file });
      setFile(null);
      setPreview('');
      setName('');
      setCategory('');
      setColor('');
      setSeasons([]);
      setStyles([]);
    } catch (err: any) {
      setError(err.message || '上传失败');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview('');
  };

  return (
    <div className="bg-surface rounded-2xl p-4 sm:p-6 space-y-4 border border-border shadow-card">
      <h3 className="text-ink font-medium flex items-center gap-2">
        <Upload className="w-4 h-4 text-primary" />
        上传新衣服
      </h3>

      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary-soft' : 'border-border hover:border-primary'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 text-ink-3 mx-auto mb-2" />
          <p className="text-ink-2 text-sm">
            {isDragActive ? '松开以上传' : '拖拽图片到此处，或点击选择'}
          </p>
          <p className="text-ink-3 text-xs mt-1">支持 JPG/PNG/GIF/WebP，最大 5MB</p>
        </div>
      ) : (
        <div className="relative">
          <img src={preview} alt="预览" className="w-full h-48 object-cover rounded-lg" />
          <button
            onClick={clearFile}
            className="absolute top-2 right-2 bg-black/60 rounded-full p-1 hover:bg-black/80"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="衣服名称（如：白色T恤）"
        className={inputClass}
      />

      <div className="grid grid-cols-2 gap-3">
        <select
          value={category}
          onChange={e => setCategory(e.target.value as ClothingCategory)}
          className={inputClass}
        >
          <option value="">选择分类</option>
          {CATEGORY_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={color}
          onChange={e => setColor(e.target.value as ClothingColor)}
          className={inputClass}
        >
          <option value="">选择颜色</option>
          {COLOR_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-xs text-ink-2 mb-2">季节（可多选）</p>
        <div className="flex flex-wrap gap-2">
          {SEASON_OPTIONS.map(s => (
            <button
              key={s.value}
              onClick={() => toggleSeason(s.value)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                seasons.includes(s.value)
                  ? 'bg-primary text-white'
                  : 'bg-surface-2 text-ink-2 hover:bg-border-strong'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-ink-2 mb-2">风格（可多选）</p>
        <div className="flex flex-wrap gap-2">
          {STYLE_OPTIONS.map(s => (
            <button
              key={s.value}
              onClick={() => toggleStyle(s.value)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                styles.includes(s.value)
                  ? 'bg-primary text-white'
                  : 'bg-surface-2 text-ink-2 hover:bg-border-strong'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-danger-on-soft text-xs">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={uploading || !file}
        className="w-full bg-primary hover:bg-primary-hover disabled:bg-ink-3 disabled:text-ink-2 disabled:cursor-not-allowed text-white rounded-lg py-2 text-sm font-medium transition-colors"
      >
        {uploading ? '上传中...' : '上传'}
      </button>
    </div>
  );
}

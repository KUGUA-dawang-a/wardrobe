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

  // 拖拽或点击选择图片
  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    // 检查文件类型
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(f.type)) {
      setError('只支持 JPG/PNG/GIF/WebP 格式');
      return;
    }
    setError('');
    setFile(f);
    setPreview(URL.createObjectURL(f));
    // 自动用文件名作为默认名称
    if (!name) setName(f.name.replace(/\.[^.]+$/, ''));
  }, [name]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDropRejected: () => setError('文件太大（最大 5MB）或不支持的类型'),
  });

  // 切换季节（多选）
  const toggleSeason = (s: Season) => {
    setSeasons(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  // 切换风格（多选）
  const toggleStyle = (s: Style) => {
    setStyles(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  // 提交上传
  const handleSubmit = async () => {
    if (!file || !name || !category || !color || seasons.length === 0 || styles.length === 0) {
      setError('请填写完整信息');
      return;
    }
    setUploading(true);
    setError('');
    try {
      await onUpload({ name, category: category as ClothingCategory, color: color as ClothingColor, season: seasons, style: styles, image: file });
      // 重置表单
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

  // 清除选择的文件
  const clearFile = () => {
    setFile(null);
    setPreview('');
  };

  return (
    <div className="bg-slate-800 rounded-xl p-4 sm:p-6 space-y-4">
      <h3 className="text-white font-medium flex items-center gap-2">
        <Upload className="w-4 h-4 text-indigo-400" />
        上传新衣服
      </h3>

      {/* 拖拽上传区域 */}
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-indigo-400 bg-indigo-900/20' : 'border-slate-600 hover:border-slate-500'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">
            {isDragActive ? '松开以上传' : '拖拽图片到此处，或点击选择'}
          </p>
          <p className="text-slate-600 text-xs mt-1">支持 JPG/PNG/GIF/WebP，最大 5MB</p>
        </div>
      ) : (
        <div className="relative">
          <img src={preview} alt="预览" className="w-full h-48 object-cover rounded-lg" />
          <button
            onClick={clearFile}
            className="absolute top-2 right-2 bg-black/60 rounded-full p-1 hover:bg-black/80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 名称 */}
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="衣服名称（如：白色T恤）"
        className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:border-indigo-400 outline-none"
      />

      {/* 分类 & 颜色（一行两个） */}
      <div className="grid grid-cols-2 gap-3">
        <select
          value={category}
          onChange={e => setCategory(e.target.value as ClothingCategory)}
          className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:border-indigo-400 outline-none"
        >
          <option value="">选择分类</option>
          {CATEGORY_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={color}
          onChange={e => setColor(e.target.value as ClothingColor)}
          className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:border-indigo-400 outline-none"
        >
          <option value="">选择颜色</option>
          {COLOR_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* 季节（多选标签） */}
      <div>
        <p className="text-xs text-slate-400 mb-2">季节（可多选）</p>
        <div className="flex flex-wrap gap-2">
          {SEASON_OPTIONS.map(s => (
            <button
              key={s.value}
              onClick={() => toggleSeason(s.value)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                seasons.includes(s.value)
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 风格（多选标签） */}
      <div>
        <p className="text-xs text-slate-400 mb-2">风格（可多选）</p>
        <div className="flex flex-wrap gap-2">
          {STYLE_OPTIONS.map(s => (
            <button
              key={s.value}
              onClick={() => toggleStyle(s.value)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                styles.includes(s.value)
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 错误提示 */}
      {error && <p className="text-red-400 text-xs">{error}</p>}

      {/* 提交按钮 */}
      <button
        onClick={handleSubmit}
        disabled={uploading || !file}
        className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg py-2 text-sm font-medium transition-colors"
      >
        {uploading ? '上传中...' : '上传'}
      </button>
    </div>
  );
}

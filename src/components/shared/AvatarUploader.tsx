import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, Link as LinkIcon, User as UserIcon } from 'lucide-react';

interface AvatarUploaderProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  label?: string;
  subtitle?: string;
}

// Client-side canvas compression for avatar photos
function compressAvatar(file: File, maxDim = 400, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

export function AvatarUploader({
  value,
  onChange,
  label = 'Profile Photo / Avatar',
  subtitle = 'Upload a photo from your device or provide an image URL',
}: AvatarUploaderProps) {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, WebP).');
      return;
    }

    setIsProcessing(true);
    try {
      const dataUrl = await compressAvatar(file);
      if (dataUrl) {
        onChange(dataUrl);
      }
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApplyUrl = () => {
    const trimmed = urlDraft.trim();
    if (trimmed) {
      onChange(trimmed);
      setUrlDraft('');
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-0.5">
            {label}
          </label>
          {subtitle && <p className="text-[11px] text-slate-500">{subtitle}</p>}
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Circular Avatar Preview */}
        <div className="relative group shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 shadow-sm flex items-center justify-center ring-2 ring-slate-100">
            {value ? (
              <img
                src={value}
                alt="Profile avatar preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';
                }}
              />
            ) : (
              <UserIcon className="w-7 h-7 text-slate-400" />
            )}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload new image"
            className="absolute bottom-0 right-0 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition-colors"
          >
            <Camera className="w-3 h-3" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-1.5 flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Processing...' : 'Upload Image'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Paste URL</span>
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange(undefined)}
                className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          {/* Paste URL Sub-input */}
          {showUrlInput && (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="url"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyUrl();
                  }
                }}
                placeholder="https://..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

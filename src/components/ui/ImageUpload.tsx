import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    // Validate
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File too large. Max 5MB.');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      setError('Use JPEG, PNG, GIF, or WebP.');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        onChange(json.url);
      }
    } catch {
      setError('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  // Show preview if there's a value
  if (value) {
    return (
      <div className="relative group">
        <div className="aspect-video rounded-lg overflow-hidden border border-flow-border">
          <img src={value} alt="" className="w-full h-full object-cover" />
        </div>
        <button
          onClick={() => onChange('')}
          className="absolute top-2 right-2 p-1.5 bg-flow-ink/70 text-white rounded-full 
                     opacity-0 group-hover:opacity-100 transition-opacity hover:bg-flow-ink"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                    transition-all duration-200
                    ${dragOver
                      ? 'border-flow-accent bg-flow-accent/5'
                      : 'border-flow-border hover:border-flow-ink/20 hover:bg-flow-warm'
                    }
                    ${uploading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="text-flow-accent animate-spin" />
            <span className="text-sm text-flow-muted">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-flow-warm flex items-center justify-center">
              <Upload size={18} className="text-flow-muted" />
            </div>
            <div>
              <span className="text-sm font-medium text-flow-ink">
                Drop an image here
              </span>
              <span className="text-sm text-flow-muted"> or click to browse</span>
            </div>
            <span className="text-xs text-flow-muted">JPEG, PNG, GIF, WebP — max 5MB</span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1.5">{error}</p>
      )}
    </div>
  );
}


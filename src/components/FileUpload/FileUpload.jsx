import { useCallback, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { ACCEPTED_EXTENSIONS } from '../../utils/constants';
import { formatFileSize } from '../../utils/formatters';

function getFileType(name) {
  const ext = name.split('.').pop()?.toUpperCase();
  const map = { CSV: 'CSV', JSON: 'JSON', XML: 'XML', XLSX: 'XLSX', PDF: 'PDF' };
  return map[ext] || ext;
}

export default function FileUpload({ onUploadComplete }) {
  const [queue, setQueue] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const simulateUpload = useCallback((fileId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setQueue((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, progress: 100, status: 'Uploaded' }
              : f
          )
        );
        setTimeout(() => {
          setQueue((prev) => {
            const file = prev.find((f) => f.id === fileId);
            if (file) {
              onUploadComplete?.(file.file);
            }
            return prev.filter((f) => f.id !== fileId);
          });
        }, 1500);
      } else {
        setQueue((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress: Math.min(progress, 99) } : f
          )
        );
      }
    }, 200);
  }, [onUploadComplete]);

  const addFiles = useCallback(
    (fileList) => {
      const newFiles = Array.from(fileList)
        .filter((f) => {
          const ext = '.' + f.name.split('.').pop()?.toLowerCase();
          return ACCEPTED_EXTENSIONS.includes(ext);
        })
        .map((f) => ({
          id: `${Date.now()}-${Math.random()}`,
          file: f,
          name: f.name,
          size: f.size,
          type: getFileType(f.name),
          progress: 0,
          status: 'Uploading',
        }));

      setQueue((prev) => [...prev, ...newFiles]);
      newFiles.forEach((f) => simulateUpload(f.id));
    },
    [simulateUpload]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const removeFile = (id) => {
    setQueue((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          dragOver
            ? 'border-brand-500 bg-brand-50'
            : 'border-slate-300 bg-slate-50/50 hover:border-slate-400'
        }`}
      >
        <Upload className="w-10 h-10 text-slate-400 mx-auto mb-4" />
        <p className="text-base font-medium text-slate-700">
          Drag & drop your files here
        </p>
        <p className="text-sm text-slate-500 mt-1">or browse from your computer</p>
        <input
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS.join(',')}
          onChange={(e) => addFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <p className="text-xs text-slate-400 mt-4">
          Accepted formats: CSV, JSON, XML, XLSX, PDF
        </p>
      </div>

      {queue.length > 0 && (
        <div className="card divide-y divide-border">
          <div className="px-4 py-3 bg-slate-50/80">
            <h3 className="text-sm font-medium text-slate-700">Upload Queue</h3>
          </div>
          {queue.map((file) => (
            <div key={file.id} className="px-4 py-3 flex items-center gap-4">
              <FileText className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                  <span className="text-xs text-slate-500">{formatFileSize(file.size)}</span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all duration-200"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-10 text-right">
                    {Math.round(file.progress)}%
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      file.status === 'Uploaded' ? 'text-emerald-600' : 'text-brand-600'
                    }`}
                  >
                    {file.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeFile(file.id)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import FileUpload from '../../components/FileUpload/FileUpload';
import { useToast } from '../../context/ToastContext';
import { uploadFile } from '../../services/fileService';

export default function FileUploadPage() {
  const { addToast } = useToast();

  const handleUploadComplete = async (file) => {
    await uploadFile(file);
    addToast(`${file.name} uploaded successfully`);
  };

  return (
    <div className="page-container space-y-6 max-w-3xl">
      <div>
        <Link
          to="/files"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Files
        </Link>
        <h1 className="page-title">Upload Files</h1>
        <p className="page-subtitle">
          Upload files for processing. Supported formats: CSV, JSON, XML, XLSX, PDF
        </p>
      </div>

      <FileUpload onUploadComplete={handleUploadComplete} />
    </div>
  );
}

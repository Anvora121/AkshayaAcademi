import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle2, FileText, Loader2, ExternalLink, Download, AlertCircle, X } from 'lucide-react';
import { API_BASE_URL } from '@/config';
import { toast } from 'sonner';

type DocType = 'resume' | 'transcript' | 'sop';

interface DocumentUploaderProps {
  docType: DocType;
  label: string;
  currentUrl?: string;
  onUploaded: (url: string) => void;
}

const ACCEPT = '.pdf,.doc,.docx,.jpg,.jpeg,.png';

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  docType,
  label,
  currentUrl,
  onUploaded,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setProgress(10);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('docType', docType);

    try {
      // Simulate progress while uploading
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 15, 85));
      }, 500);

      const res = await fetch(`${API_BASE_URL}/uploads/document`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Upload failed');
      }

      const data = await res.json();
      toast.success(`${label} uploaded successfully!`);
      onUploaded(data.url);
    } catch (err: any) {
      toast.error(err.message || `Failed to upload ${label}`);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
      }, 600);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // Reset input so same file can be re-uploaded
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const hasFile = !!currentUrl;

  return (
    <div className="flex flex-col gap-3">
      {/* Drop zone / Upload trigger */}
      <motion.div
        onClick={() => !isUploading && fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        className={`relative p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
          dragOver
            ? 'border-accent bg-accent/10 scale-[1.01]'
            : hasFile
            ? 'border-accent/40 bg-accent/5'
            : 'border-border bg-secondary/20 hover:border-accent/50 hover:bg-accent/5'
        } ${isUploading ? 'pointer-events-none' : ''}`}
      >
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center gap-3 text-center">
          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div
                key="uploading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 42 42">
                    <circle cx="21" cy="21" r="18" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                    <motion.circle
                      cx="21" cy="21" r="18" fill="none"
                      stroke="hsl(var(--accent))" strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${progress * 1.131} ${113.1 - progress * 1.131}`}
                      strokeDashoffset="0"
                      transition={{ duration: 0.3 }}
                    />
                  </svg>
                  <Loader2 className="absolute inset-0 m-auto w-5 h-5 text-accent animate-spin" />
                </div>
                <span className="text-xs text-muted-foreground">Uploading to Google Drive… {progress}%</span>
              </motion.div>
            ) : hasFile ? (
              <motion.div
                key="uploaded"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                </div>
                <span className="text-xs font-medium text-accent">{label} uploaded</span>
                <span className="text-xs text-muted-foreground">Click to replace</span>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-10 h-10 rounded-full bg-secondary/60 flex items-center justify-center">
                  {dragOver ? (
                    <Upload className="w-5 h-5 text-accent" />
                  ) : (
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <span className="text-xs font-medium text-foreground">
                  {dragOver ? 'Drop to upload' : `Upload ${label}`}
                </span>
                <span className="text-xs text-muted-foreground">PDF, DOC, PNG — max 10 MB</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        {isUploading && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-accent rounded-b-2xl"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>

      {/* Action buttons when file exists */}
      {hasFile && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2"
        >
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors border border-accent/20"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View
          </a>
          <a
            href={currentUrl?.replace('/view', '/download') ?? currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-secondary/50 text-foreground text-xs font-medium hover:bg-secondary transition-colors border border-border"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </a>
        </motion.div>
      )}
    </div>
  );
};

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface UploadedFile {
    name: string;
    url: string;
    size: number;
}

interface FileUploadFieldProps {
    label: string;
    accept?: Record<string, string[]>;
    uploadedFile?: UploadedFile | null;
    isUploading?: boolean;
    uploadProgress?: number;
    onUpload: (file: File) => void;
    onRemove: () => void;
    hint?: string;
    required?: boolean;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
    label,
    accept = {
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    uploadedFile,
    isUploading = false,
    uploadProgress = 0,
    onUpload,
    onRemove,
    hint = 'PDF, DOC, DOCX up to 5MB',
    required = false,
}) => {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                onUpload(acceptedFiles[0]);
            }
        },
        [onUpload]
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept,
        maxSize: 5 * 1024 * 1024,
        multiple: false,
        disabled: isUploading || !!uploadedFile,
    });

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-sm font-bold text-foreground/80 ml-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <AnimatePresence mode="wait">
                {uploadedFile ? (
                    <motion.div
                        key="uploaded"
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="flex items-center gap-4 p-4 bg-accent/5 border border-accent/20 rounded-2xl relative overflow-hidden"
                    >
                         <div className="absolute right-0 top-0 p-4 opacity-5 pointer-events-none">
                            <CheckCircle2 className="w-12 h-12 text-accent" />
                        </div>

                        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-foreground truncate">{uploadedFile.name}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{formatSize(uploadedFile.size)}</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={onRemove}
                            className="p-2 hover:bg-red-500/10 text-muted-foreground/60 hover:text-red-500 rounded-xl transition-colors relative z-10"
                        >
                            <X className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                ) : isUploading ? (
                    <motion.div
                        key="uploading"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 bg-secondary/20 border border-border/50 rounded-2xl"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center animate-pulse">
                                <Upload className="w-5 h-5 text-accent" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-black text-accent uppercase tracking-widest leading-none mb-1">Uploading</p>
                                <p className="text-sm font-bold text-foreground">Please wait a moment...</p>
                            </div>
                            <span className="text-lg font-black text-accent">{uploadProgress}%</span>
                        </div>
                        <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]"
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="dropzone"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        {...getRootProps()}
                        className={cn(
                            "group flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-3xl cursor-pointer transition-all relative overflow-hidden",
                            isDragActive 
                                ? "border-accent bg-accent/5 ring-4 ring-accent/10" 
                                : "border-border/60 hover:border-accent/40 hover:bg-accent/5",
                            isDragReject && "border-red-500 bg-red-500/5 ring-red-500/10"
                        )}
                    >
                        <input {...getInputProps()} />
                        
                        <div className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
                            isDragActive ? "bg-accent text-white scale-110 shadow-xl shadow-accent/20" : "bg-secondary/50 text-muted-foreground/60 group-hover:bg-accent group-hover:text-white group-hover:shadow-xl group-hover:shadow-accent/20"
                        )}>
                            {isDragReject ? <AlertCircle className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                        </div>

                        <div className="text-center relative z-10">
                            <p className="text-base font-black text-foreground mb-1">
                                {isDragActive ? 'Drop to upload' : 'Drag & drop your file'}
                            </p>
                            <p className="text-sm font-medium text-muted-foreground/60">
                                or <span className="text-accent underline underline-offset-4 decoration-2">click to browse</span>
                            </p>
                            {hint && <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest mt-4">{hint}</p>}
                        </div>

                        {/* Background Decoration */}
                        <div className={cn(
                            "absolute inset-0 -z-10 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-500",
                            isDragActive && "opacity-100"
                        )} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

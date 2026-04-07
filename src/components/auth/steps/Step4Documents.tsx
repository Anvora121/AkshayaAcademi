import React from 'react';
import { FileText, ScrollText, FileCheck, ShieldCheck, Sparkles, Files, Info } from 'lucide-react';
import { FileUploadField } from '../FileUploadField';
import { motion } from 'framer-motion';

interface UploadedFile {
    name: string;
    url: string;
    size: number;
}

interface Step4Data {
    resumeURL: string;
    transcriptURL: string;
    sopURL: string;
}

interface Step4Props {
    data: Step4Data;
    uploadedFiles: {
        resume: UploadedFile | null;
        transcript: UploadedFile | null;
        sop: UploadedFile | null;
    };
    onFileUpload: (field: 'resume' | 'transcript' | 'sop', file: File) => Promise<void>;
    onFileRemove: (field: 'resume' | 'transcript' | 'sop') => void;
    uploading: { resume: boolean; transcript: boolean; sop: boolean };
    uploadProgress: { resume: number; transcript: number; sop: number };
    errors: Partial<Record<keyof Step4Data, string>>;
}

export const Step4Documents: React.FC<Step4Props> = ({
    uploadedFiles,
    onFileUpload,
    onFileRemove,
    uploading,
    uploadProgress,
    errors,
}) => {
    return (
        <div className="space-y-10">
            {/* Header Info */}
            <div className="p-6 bg-secondary/30 backdrop-blur-sm border border-border rounded-3xl relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-5">
                    <Files className="w-16 h-16 text-accent" />
                </div>
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent/10 rounded-2xl shrink-0">
                        <Info className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                        <h4 className="text-base font-black text-foreground mb-1 tracking-tight italic">Document Guidelines</h4>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            Upload your supporting documents for evaluation. High-quality scans in 
                            <strong className="text-foreground"> PDF, DOC, or DOCX</strong> (max 
                            <strong className="text-foreground"> 5 MB</strong>) ensure faster processing.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Resume Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 ml-1 mb-2">
                         <div className="p-1.5 bg-accent/10 rounded-lg">
                            <FileText className="w-4 h-4 text-accent" />
                        </div>
                        <h4 className="text-sm font-black text-foreground uppercase tracking-wider">Resume / CV <span className="text-red-500 ml-1">*</span></h4>
                    </div>
                    <FileUploadField
                        label=""
                        uploadedFile={uploadedFiles.resume}
                        isUploading={uploading.resume}
                        uploadProgress={uploadProgress.resume}
                        onUpload={(file) => onFileUpload('resume', file)}
                        onRemove={() => onFileRemove('resume')}
                        hint="Your latest professional CV — PDF preferred"
                        required
                    />
                    {errors.resumeURL && (
                        <motion.p 
                            initial={{ opacity: 0, x: -10 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            className="text-xs font-black text-red-500 ml-1"
                        >
                            {errors.resumeURL}
                        </motion.p>
                    )}
                </div>

                {/* Transcript Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 ml-1 mb-2">
                        <div className="p-1.5 bg-accent/10 rounded-lg">
                            <ScrollText className="w-4 h-4 text-accent" />
                        </div>
                        <h4 className="text-sm font-black text-foreground uppercase tracking-wider">Academic Transcript</h4>
                    </div>
                    <FileUploadField
                        label=""
                        uploadedFile={uploadedFiles.transcript}
                        isUploading={uploading.transcript}
                        uploadProgress={uploadProgress.transcript}
                        onUpload={(file) => onFileUpload('transcript', file)}
                        onRemove={() => onFileRemove('transcript')}
                        hint="Latest marksheet or consolidated transcript"
                    />
                </div>

                {/* SOP Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 ml-1 mb-2">
                        <div className="p-1.5 bg-accent/10 rounded-lg">
                            <FileCheck className="w-4 h-4 text-accent" />
                        </div>
                        <h4 className="text-sm font-black text-foreground uppercase tracking-wider">Statement of Purpose</h4>
                    </div>
                    <FileUploadField
                        label=""
                        uploadedFile={uploadedFiles.sop}
                        isUploading={uploading.sop}
                        uploadProgress={uploadProgress.sop}
                        onUpload={(file) => onFileUpload('sop', file)}
                        onRemove={() => onFileRemove('sop')}
                        hint="Letter of intent or personal statement"
                    />
                </div>
            </div>

            {/* Premium Trust Banner */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-4 p-6 bg-accent/5 border border-accent/10 rounded-3xl relative overflow-hidden"
            >
                <div className="absolute right-0 top-0 p-4 opacity-5">
                    <ShieldCheck className="w-16 h-16 text-accent" />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <div>
                    <h4 className="text-base font-black text-foreground mb-1 italic">Draft Saving Enabled</h4>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        Don't have everything yet? No worries! You can skip optional documents for now
                        and upload them later from your profile. Your progress is auto-saved.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

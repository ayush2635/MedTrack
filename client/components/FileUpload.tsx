'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, Loader2, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    isProcessing: boolean;
}

export default function FileUpload({ onFileSelect, isProcessing }: FileUploadProps) {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    }, [onFileSelect]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    }, [onFileSelect]);

    return (
        <div
            className={`relative group border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ease-in-out ${dragActive
                ? 'border-teal-500 bg-teal-50 scale-[1.02]'
                : 'border-gray-200 hover:border-teal-400 hover:bg-gray-50'
                }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleChange}
                accept=".pdf,.jpg,.jpeg,.png"
                disabled={isProcessing}
            />

            <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
                {isProcessing ? (
                    <>
                        <div className="relative">
                            <div className="absolute inset-0 bg-teal-200 rounded-full animate-ping opacity-75"></div>
                            <div className="relative bg-white p-4 rounded-full shadow-sm border border-teal-100">
                                <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                            </div>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-900">Analyzing Report...</p>
                            <p className="text-sm text-gray-500">Our AI is reading your document</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="p-4 bg-teal-50 rounded-full group-hover:bg-teal-100 transition-colors duration-300">
                            <Upload className="w-8 h-8 text-teal-600" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-900">
                                Drop your lab report here
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Supports PDF, JPG, PNG
                            </p>
                        </div>
                        <div className="flex gap-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> PDF</span>
                            <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Images</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

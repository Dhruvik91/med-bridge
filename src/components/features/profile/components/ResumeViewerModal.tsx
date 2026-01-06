'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, ExternalLink, AlertCircle } from 'lucide-react';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ResumeViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    resumeUrl: string;
    candidateName?: string;
}

export function ResumeViewerModal({ isOpen, onClose, resumeUrl, candidateName }: ResumeViewerModalProps) {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showViewer, setShowViewer] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setError(null);
            setIsLoading(true);
            setShowViewer(false);
            
            // Delay showing the viewer to avoid React strict mode double-mount issues
            const timer = setTimeout(() => {
                setIsLoading(false);
                setShowViewer(true);
            }, 500);

            return () => {
                clearTimeout(timer);
                setShowViewer(false);
            };
        } else {
            setShowViewer(false);
        }
    }, [isOpen, resumeUrl]);

    const docs = [
        {
            uri: resumeUrl,
            fileName: candidateName ? `${candidateName}_Resume` : 'Resume',
        },
    ];

    const handleDownload = () => {
        window.open(resumeUrl, '_blank');
    };

    const handleDocumentLoadError = (e: any) => {
        console.error('Document load error:', e);
        setError('Unable to load the resume. The file may be in an unsupported format or temporarily unavailable.');
        setIsLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] w-full h-[90vh] md:max-w-5xl md:h-[85vh] p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="text-lg font-semibold">
                        {candidateName ? `${candidateName}'s Resume` : 'Resume'}
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownload}
                            className="hidden sm:flex"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDownload}
                            className="sm:hidden"
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden p-4 md:p-6">
                    {error ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-4 p-4">
                            <Alert variant="destructive" className="max-w-md">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                            <Button
                                variant="outline"
                                onClick={() => window.open(resumeUrl, '_blank')}
                            >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open in New Tab
                            </Button>
                        </div>
                    ) : isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center space-y-2">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                <p className="text-sm text-muted-foreground">Loading resume...</p>
                            </div>
                        </div>
                    ) : showViewer ? (
                        <div className="h-full w-full overflow-auto">
                            <DocViewer
                                documents={docs}
                                config={{
                                    header: {
                                        disableHeader: true,
                                        disableFileName: true,
                                    },
                                }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                className="resume-doc-viewer"
                            />
                        </div>
                    ) : null}
                </div>

                <style jsx global>{`
                    .resume-doc-viewer {
                        border-radius: 8px;
                    }
                    
                    .resume-doc-viewer #pdf-controls {
                        background: hsl(var(--background));
                        border-bottom: 1px solid hsl(var(--border));
                        padding: 0.5rem;
                    }
                    
                    .resume-doc-viewer #pdf-controls button {
                        background: hsl(var(--primary));
                        color: hsl(var(--primary-foreground));
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 0.375rem;
                        cursor: pointer;
                        font-size: 0.875rem;
                    }
                    
                    .resume-doc-viewer #pdf-controls button:hover {
                        opacity: 0.9;
                    }
                    
                    @media (max-width: 768px) {
                        .resume-doc-viewer #pdf-controls {
                            padding: 0.25rem;
                        }
                        
                        .resume-doc-viewer #pdf-controls button {
                            padding: 0.375rem 0.75rem;
                            font-size: 0.75rem;
                        }
                    }
                `}</style>
            </DialogContent>
        </Dialog>
    );
}

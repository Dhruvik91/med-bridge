import { useMutation } from '@tanstack/react-query';
import { uploadService } from '@/services/upload.service';
import { useToast } from '@/hooks/use-toast';

export const useUploadFile = () => {
    const { toast } = useToast();

    return useMutation({
        mutationFn: (file: File) => uploadService.uploadFile(file),
        onError: (error: any) => {
            toast({
                title: 'Upload failed',
                description: error.response?.data?.message || 'Failed to upload file',
                variant: 'destructive',
            });
        },
    });
};

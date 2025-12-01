import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';

export const uploadService = {
    async uploadFile(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await httpService.post<{ url: string }>(
            API_CONFIG.path.uploads,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data.url;
    },
};

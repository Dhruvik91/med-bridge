import httpService from '@/lib/http-service';
import { Attachment, CreateAttachmentDto } from '@/types';

export const attachmentService = {
  async findAll(ownerType?: string, ownerId?: string): Promise<Attachment[]> {
    let url = '/attachments';
    if (ownerType && ownerId) {
      url += `?ownerType=${encodeURIComponent(ownerType)}&ownerId=${encodeURIComponent(ownerId)}`;
    }
    const response = await httpService.get<Attachment[]>(url);
    return response.data;
  },

  async findOne(id: string): Promise<Attachment> {
    const response = await httpService.get<Attachment>(`/attachments/${id}`);
    return response.data;
  },

  async create(data: CreateAttachmentDto): Promise<Attachment> {
    const response = await httpService.post<Attachment>('/attachments', data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`/attachments/${id}`);
  },
};

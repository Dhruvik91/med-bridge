import httpService from '@/lib/http-service';
import { Message, CreateMessageDto } from '@/types';

export const messageService = {
  async findAllForUser(userId: string): Promise<Message[]> {
    const response = await httpService.get<Message[]>(`/messages/user/${userId}`);
    return response.data;
  },

  async send(data: CreateMessageDto): Promise<Message> {
    const response = await httpService.post<Message>('/messages', data);
    return response.data;
  },
};

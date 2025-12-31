import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UserClient } from '../shared/user.client';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly userClient: UserClient,
  ) {}

  async sendMessage(
    senderId: string,
    data: CreateMessageDto,
  ): Promise<Message> {
    const recipient = await this.userClient.getUserById(data.recipientId);
    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }

    const message = this.messagesRepository.create({
      senderId,
      recipientId: data.recipientId,
      content: data.content,
    });
    return this.messagesRepository.save(message);
  }

  async getConversation(
    currentUserId: string,
    otherUserId: string,
  ): Promise<any[]> {
    const [currentUser, otherUser] = await Promise.all([
      this.userClient.getUserById(currentUserId),
      this.userClient.getUserById(otherUserId),
    ]);

    const messages = await this.messagesRepository
      .createQueryBuilder('m')
      .where(
        '(m.senderId = :currentUserId AND m.recipientId = :otherUserId) OR (m.senderId = :otherUserId AND m.recipientId = :currentUserId)',
        { currentUserId, otherUserId },
      )
      .orderBy('m.createdAt', 'ASC')
      .getMany();

    return messages.map((m) => ({
      ...m,
      sender:
        m.senderId === currentUserId
          ? currentUser
          : otherUser,
      recipient:
        m.recipientId === currentUserId
          ? currentUser
          : otherUser,
    }));
  }
}


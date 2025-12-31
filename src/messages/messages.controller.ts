import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../shared/jwt-auth.guard';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async send(@Req() req: any, @Body() body: CreateMessageDto) {
    const senderId = req.user.sub as string;
    return this.messagesService.sendMessage(senderId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('conversation/:userId')
  async getConversation(@Req() req: any, @Param('userId') userId: string) {
    const currentUserId = req.user.sub as string;
    return this.messagesService.getConversation(currentUserId, userId);
  }
}


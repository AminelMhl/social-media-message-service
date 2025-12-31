import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  recipientId!: string;

  @IsNotEmpty()
  content!: string;
}


import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../messages/message.entity';
import { MessagesService } from '../messages/messages.service';
import { MessagesController } from '../messages/messages.controller';
import { AuthService } from '../shared/auth.service';
import { UserClient } from '../shared/user.client';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'social_user',
        password: process.env.DB_PASSWORD || 'social_pass',
        database: process.env.DB_NAME || 'social_db',
        entities: [Message],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Message]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, AuthService, UserClient],
})
export class AppModule {}


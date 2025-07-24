import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { EventService } from './event/event.service';
import { EventController } from './event/event.controller';
import { EventModule } from './event/event.module';

@Module({
  imports: [UserModule, AuthModule, EventModule],
  controllers: [AppController, AuthController, EventController],
  providers: [AppService, PrismaService, AuthService, EventService],
})
export class AppModule {}

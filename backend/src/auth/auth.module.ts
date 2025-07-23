import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ UserModule, JwtModule.register({secret: 'YOUR_SECRET_KEY', signOptions: {expiresIn: '60m'}}) ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
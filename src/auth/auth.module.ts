import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { UsersModule } from '../users/users.module';
import { HashModule } from '../hash/hash.module';

@Module({
  imports: [UsersModule, HashModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

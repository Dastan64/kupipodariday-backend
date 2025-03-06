import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  auth = (user: User) => {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  };

  validatePassword = async (username: string, password: string) => {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      return null;
    }

    const hasMatch = await bcrypt.compare(password, user.password);

    return hasMatch ? user : null;
  };
}

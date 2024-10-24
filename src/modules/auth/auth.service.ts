import { HttpException } from '@thanhhoajs/thanhhoa';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { authConfig } from '../../configs/auth.config';
import type { JwtPayloadType } from '../../shared/types';
import type { SessionService } from '../session/session.service';
import type { UserService } from '../user/user.service';

export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  async register(dto: any) {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = await this.userService.createUser({
        ...dto,
        password: hashedPassword,
      });

      const token = await this.signToken(user.id);

      return {
        user,
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    const userExist = await this.userService.getUserByEmail(email);

    if (!userExist) {
      throw new HttpException('User not found', 404);
    }

    const passwordMatch = await bcrypt.compare(password, userExist.password);
    if (!passwordMatch) {
      throw new HttpException('Invalid password', 401);
    }

    const token = await this.signToken(userExist.id);

    return {
      user: {
        ...userExist,
        password: undefined,
      },
      token,
    };
  }

  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(
        token,
        authConfig.accessTokenSecret as string,
      ) as JwtPayloadType;

      return await this.sessionService.get(decoded.session);
    } catch (error) {
      throw new HttpException('Invalid token', 401);
    }
  }

  private async signToken(userId: number): Promise<string> {
    const payload = await this.sessionService.create({
      userId,
      expiresAt: new Date(
        Date.now() + Number(authConfig.accessTokenLifetime) * 1000,
      ),
    });

    const token = jwt.sign(
      { session: payload.id },
      authConfig.accessTokenSecret as string,
      {
        expiresIn: Number(authConfig.accessTokenLifetime),
      },
    );

    return token;
  }
}

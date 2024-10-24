import {
  HttpException,
  type IRequestContext,
  type Middleware,
} from '@thanhhoajs/thanhhoa';

import type { AuthService } from '../../modules/auth/auth.service';

export class Guard {
  constructor(private authService: AuthService) {}

  check: Middleware = async (
    context: IRequestContext,
    next: () => Promise<Response>,
  ): Promise<Response> => {
    const token = context.request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response('Unauthorized', { status: 401 });
    }

    try {
      const user = await this.authService.verifyToken(token);
      context.user = user;
      return next();
    } catch (error) {
      throw new HttpException('Invalid token', 401);
    }
  };
}

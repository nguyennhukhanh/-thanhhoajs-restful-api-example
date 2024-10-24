import type { IRequestContext, ThanhHoa } from '@thanhhoajs/thanhhoa';

import { UserService } from '../user/user.service';
import { SessionService } from './../session/session.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

export class AuthModule {
  constructor(app: ThanhHoa) {
    const userService = new UserService();
    const sessionService = new SessionService();

    const authService = new AuthService(userService, sessionService);
    const authController = new AuthController(authService);

    app.post('/auth/login', (context: IRequestContext) =>
      authController.login(context),
    );

    app.post('/auth/register', (context: IRequestContext) =>
      authController.register(context),
    );
  }
}

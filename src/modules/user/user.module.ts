import type { IRequestContext, ThanhHoa } from '@thanhhoajs/thanhhoa';

import { Guard } from '../../common/middlewares/guard.middleware';
import { AuthService } from '../auth/auth.service';
import { SessionService } from '../session/session.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

export class UserModule {
  constructor(app: ThanhHoa) {
    const userService = new UserService();
    const sessionService = new SessionService();

    const authService = new AuthService(userService, sessionService);
    const userController = new UserController();
    const guard = new Guard(authService);

    app.get('/user', guard.check, (context: IRequestContext) =>
      userController.getProfile(context),
    );
  }
}

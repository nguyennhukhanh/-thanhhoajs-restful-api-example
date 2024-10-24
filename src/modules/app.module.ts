import { Logger } from '@thanhhoajs/logger';
import type { ThanhHoa } from '@thanhhoajs/thanhhoa';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

const logger = Logger.get('RESPONSE');

export class AppModule {
  constructor(app: ThanhHoa) {
    new AuthModule(app);
    new UserModule(app);

    // Global middleware example
    app.use(async (context, next) => {
      logger.verbose(
        `Request received: ${context.request.method} ${context.request.url}`,
      );
      const response = await next();
      logger.verbose(`Response sent: ${response.status}`);
      return response;
    });
  }
}

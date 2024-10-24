import type { ThanhHoa } from '@thanhhoajs/thanhhoa';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

export class AppModule {
  constructor(app: ThanhHoa) {
    new AuthModule(app);
    new UserModule(app);

    // Global middleware example
    app.use(async (context, next) => {
      console.log(
        `Request received: ${context.request.method} ${context.request.url}`,
      );
      const response = await next();
      console.log(`Response sent: ${response.status}`);
      return response;
    });
  }
}

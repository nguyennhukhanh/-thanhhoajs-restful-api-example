import {
  corsMiddleware,
  helmetMiddleware,
  setupSwagger,
  ThanhHoa,
} from '@thanhhoajs/thanhhoa';

import { swaggerSpec } from './common/swagger/swagger-spec';
import { runValidators } from './configs';
import { appConfig } from './configs/app.config';
import { AppModule } from './modules/app.module';

// Set the timezone to UTC
process.env.TZ = 'Etc/Universal';
const docsRoute = '/api/docs';

runValidators();

const app = new ThanhHoa();

new AppModule(app);

app.use(corsMiddleware());
app.use((context, next) => {
  // Apply helmet middleware only for non-docs requests
  if (!context.request.url.includes(docsRoute)) {
    return helmetMiddleware()(context, next);
  }
  return next();
});

setupSwagger(app, docsRoute, swaggerSpec);

app.listen({ port: appConfig.port, development: true });

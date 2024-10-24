import { createValidator } from '@thanhhoajs/validator';

const appValidator = createValidator();

appValidator.field('port').required().number();

const appConfig = {
  port: Number(process.env.PORT),
};

export { appConfig, appValidator };

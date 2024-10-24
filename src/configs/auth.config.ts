import { createValidator } from '@thanhhoajs/validator';

const authValidator = createValidator();

authValidator.field('accessTokenSecret').required().string();

authValidator.field('accessTokenLifetime').required().number();

const authConfig = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenLifetime: Number(process.env.ACCESS_TOKEN_LIFETIME),
};

export { authConfig, authValidator };

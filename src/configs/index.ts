import { Logger } from '@thanhhoajs/logger';

import { appConfig, appValidator } from './app.config';
import { authConfig, authValidator } from './auth.config';
import { dbConfig, dbValidator } from './database.config';

const logger = Logger.get('Configs');

export const runValidators = async () => {
  try {
    const results = await Promise.all([
      dbValidator.validate(dbConfig),
      authValidator.validate(authConfig),
      appValidator.validate(appConfig),
    ]);

    const allErrors = results.filter((errors) => errors.length > 0);

    if (allErrors.length > 0) {
      console.error('Validation errors:', allErrors);
      process.exit(1);
    } else {
      logger.success('All configurations are valid!');
    }
  } catch (error: any) {
    logger.error(`An error occurred during validation: ${error.message}`);
    process.exit(1);
  }
};

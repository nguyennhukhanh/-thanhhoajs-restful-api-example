import { HttpException } from '@thanhhoajs/thanhhoa';
import { createValidator } from '@thanhhoajs/validator';

const validator = createValidator();

validator.field('email').required().email();

validator.field('password').required().min(6);

validator.field('fullName').required().string().min(3).max(50);

export class CreateUserDto {
  email: string;
  password: string;
  fullName: string;

  constructor(email: string, password: string, fullName: string) {
    this.email = email;
    this.password = password;
    this.fullName = fullName;
  }

  async validate() {
    const errors = await validator.validate(this);
    if (errors.length > 0) {
      throw new HttpException('Validation failed', 400, errors);
    }
  }
}

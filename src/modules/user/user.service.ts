import { HttpException } from '@thanhhoajs/thanhhoa';
import { eq } from 'drizzle-orm';

import { db } from '../../database/db';
import { users } from '../../database/schemas/users.schema';
import type { CreateUserDto } from '../auth/dto/user.create';

export class UserService {
  async getUserById(id: number) {
    const usersExist = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return usersExist[0];
  }

  async getUserByEmail(email: string) {
    const usersExist = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return usersExist[0];
  }

  async createUser(dto: CreateUserDto): Promise<any> {
    try {
      const usersExist = await this.getUserByEmail(dto.email);
      if (usersExist) {
        throw new HttpException('Email already exist', 409);
      }

      const newUsers = await db.insert(users).values(dto).$returningId();
      return {
        id: newUsers[0].id,
        ...dto,
        password: undefined,
      };
    } catch (error) {
      throw error;
    }
  }
}

import { HttpException } from '@thanhhoajs/thanhhoa';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

import { db } from '../../database/db';
import { sessions } from '../../database/schemas/sessions.schema';
import { users } from '../../database/schemas/users.schema';

export class SessionService {
  async create(options: {
    sessionId?: string;
    userId: number;
    expiresAt: Date;
  }) {
    const { sessionId, userId } = options;
    let sessionsExist: any[] = [];

    if (sessionId) {
      sessionsExist = await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, sessionId))
        .limit(1);
    } else if (userId) {
      sessionsExist = await db
        .select()
        .from(sessions)
        .where(eq(sessions.userId, userId))
        .limit(1);
    }

    // If a session exist, delete it
    if (sessionsExist.length > 0) {
      await this.delete({ userId: sessionsExist[0].userId });
    }

    // Create a new session
    const newSession = {
      id: uuidv4(),
      expiresAt: options.expiresAt,
      userId: options.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(sessions).values(newSession);
    return newSession;
  }

  async delete(
    options: Partial<{ sessionId: string; userId: number }>,
  ): Promise<boolean> {
    const { sessionId, userId } = options;
    const whereClause = sessionId
      ? eq(sessions.id, sessionId)
      : userId
      ? eq(sessions.userId, userId)
      : null;

    if (!whereClause) {
      throw new HttpException(
        'Either id or userId must be provided for deletion.',
        500,
      );
    }

    const result = await db.delete(sessions).where(whereClause);

    return result[0].affectedRows > 0;
  }

  async get(sessionId: string) {
    const sessionsExist = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(sessions)
      .where(
        sql`${sessions.id} = ${sessionId} AND ${
          sessions.expiresAt
        } > ${new Date()}`,
      )
      .innerJoin(users, eq(sessions.userId, users.id))
      .limit(1);

    if (sessionsExist.length > 0) {
      return sessionsExist[0];
    }

    throw new HttpException('Session not found', 404);
  }
}

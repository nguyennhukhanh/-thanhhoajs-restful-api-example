<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1_M5tYoaKfXpqsOAPQl3WVWs9u5NWrG76" alt="ThanhHoa Logo" width="300"/>
</p>

# ThanhHoa Framework

ThanhHoa is a lightweight, high-performance framework built on Bun for creating modern, scalable server applications. It provides built-in utilities for routing, middleware, validation, security, and Swagger documentation.

## Installation

Install the framework and the necessary dependencies:

```bash
bun add @thanhhoajs/thanhhoa @thanhhoajs/logger @thanhhoajs/validator
```

Ensure you also install the peer dependencies like `drizzle-orm` for database interaction:

```bash
bun add drizzle-orm mysql2
```

## Project Structure

```plaintext
src/
│
├── common/
│   └── swagger/
│       ├── swagger-options.ts
│       └── swagger-spec.ts
│   └── middlewares/
│       └── guard.middleware.ts
├── configs/
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── validator.config.ts
│   └── index.ts
├── database/
│   ├── schemas/
│   │   ├── sessions.schema.ts
│   │   └── users.schema.ts
│   ├── seeds/
│   │   └── any.seed.ts
│   ├── migrations/
│   │   └── any.sql
│   └── db.ts
├── modules/
│   ├── auth/
│   │   ├── dto/
│   │   │   └── user.create.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── user/
│   │   ├── user.module.ts
│   │   ├── user.service.ts
│   │   └── user.entity.ts
│   └── app.module.ts
└── main.ts
```

### 1. **Modules**

Each module defines a specific part of the app, such as authentication or user management. Modules organize routes, controllers, and services.

Example: `AuthModule`

```ts
import { ThanhHoa } from '@thanhhoajs/thanhhoa';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

export class AppModule {
  constructor(app: ThanhHoa) {
    new AuthModule(app);
    new UserModule(app);

    // Add global middleware (e.g., logging)
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
```

### 2. **Controllers**

Controllers handle routing, input validation, and communicate with services. They often include Swagger annotations for API documentation.

Example: `AuthController`

```ts
import { IRequestContext } from '@thanhhoajs/thanhhoa';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/user.create';

export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * @swagger
   * paths:
   *   /auth/register:
   *     post:
   *       summary: Register
   */
  async register(context: IRequestContext): Promise<Response> {
    const { email, password, fullName } = await context.request.json();
    const dto = new CreateUserDto(email, password, fullName);
    await dto.validate();

    const user = await this.authService.register(dto);
    return new Response(JSON.stringify(user), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
```

### 3. **Services**

Services manage the business logic and handle communication with models or external systems, like the database.

Example: `AuthService`

```ts
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

export class AuthService {
  constructor(private userService: UserService) {}

  async register(dto: any) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.createUser({
      ...dto,
      password: hashedPassword,
    });
    return { user };
  }
}
```

### 4. **Models & Repositories**

The framework uses `drizzle-orm` to interact with the database. Define your models and repositories for interacting with data.

Example: `User Model`

```ts
import { mysqlTable, varchar, int, timestamp } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int().primaryKey().autoincrement(),
  email: varchar({ length: 100 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow(),
});
```

### 5. **Configuration**

Set up configuration files and validators to ensure the application is running with the correct environment settings.

Example: `Database Config`

```ts
import { createValidator } from '@thanhhoajs/validator';

const dbValidator = createValidator();
dbValidator.field('host').required().string();

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
};

export { dbConfig, dbValidator };
```

### 6. **Middleware**

ThanhHoa supports middleware, including built-in middleware for CORS, Helmet, etc.

Example: Using CORS and Helmet Middleware

```ts
import { corsMiddleware, helmetMiddleware } from '@thanhhoajs/thanhhoa';

app.use(corsMiddleware());
app.use((context, next) => {
  if (!context.request.url.includes('/api/docs')) {
    return helmetMiddleware()(context, next);
  }
  return next();
});
```

### 7. **Swagger Documentation**

Use Swagger for automatic API documentation.

Example: `swagger-spec.ts`

```ts
import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerOptions } from './swagger-options';

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
```

## Running the Application

To start the development server:

```bash
bun dev
```

The API will be available at `http://localhost:1410` by default. Access the Swagger documentation at `http://localhost:1410/api/docs`.

## Author

Nguyen Nhu Khanh <kwalker.nnk@gmail.com>

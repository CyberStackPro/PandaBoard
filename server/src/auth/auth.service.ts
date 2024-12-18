import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as schema from '../users/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(request: typeof schema.users.$inferInsert) {
    const existingUser = await this.database.query.users.findFirst({
      where: eq(schema.users.email, request.email),
    });

    if (existingUser) {
      throw new BadRequestException('Email is already in use.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(request.password, 10);

    // Insert the new user
    // const [newUser] = await this.database
    //   .insert(schema.users)
    //   .values({
    //     ...request,
    //     password: hashedPassword,
    //   })
    //   .returning();
    const [newUser] = await this.database.transaction(async (tx) => {
      const [user] = await tx
        .insert(schema.users)
        .values({
          ...request,
          password: hashedPassword,
        })
        .returning();

      await tx.insert(schema.profiles).values({
        user_id: user.id,
        preferences: { notifications: true, theme: 'light' },
        social_links: {},
      });

      return [user];
    });

    return this.generateAuthResponse(newUser);
  }

  async signin(email: string, password: string) {
    const user = await this.database.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    await this.database
      .update(schema.users)
      .set({
        last_login: new Date(),
        login_count: user.login_count + 1,
      })
      .where(eq(schema.users.id, user.id));

    return this.generateAuthResponse(user);
  }

  private async generateAuthResponse(user: typeof schema.users.$inferSelect) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      accessToken,
    };
  }
}

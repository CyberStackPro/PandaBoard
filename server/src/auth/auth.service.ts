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

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
  };
  tokens: AuthTokens;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(
    request: typeof schema.users.$inferInsert,
  ): Promise<AuthResponse> {
    const existingUser = await this.database.query.users.findFirst({
      where: eq(schema.users.email, request.email),
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(request.password, 10);

    const [user] = await this.database.transaction(async (tx) => {
      const [newUser] = await tx
        .insert(schema.users)
        .values({
          name: request.name,
          email: request.email,
          password: hashedPassword,
        })
        .returning();

      await tx.insert(schema.profiles).values({
        user_id: newUser.id,
        preferences: { notifications: true, theme: 'light' },
      });

      return [newUser];
    });

    const tokens = await this.generateAuthTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
      tokens,
    };
  }

  async signin(email: string, password: string): Promise<AuthResponse> {
    const user = await this.database.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // if (!user || !(await bcrypt.compare(password, user?.password))) {
    //   throw new UnauthorizedException('Invalid credentials');
    // }
    const isPasswordValid = await bcrypt.compare(password, user?.password);
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

    const tokens = await this.generateAuthTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
      tokens,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.database
      .update(schema.users)
      .set({
        refresh_token: null,
      })
      .where(eq(schema.users.id, userId));
  }
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET, // Use separate secret for refresh tokens
      });

      const user = await this.database.query.users.findFirst({
        where: eq(schema.users.id, payload.sub),
      });

      if (!user?.refresh_token) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isValid = await bcrypt.compare(refreshToken, user.refresh_token);
      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newTokens = await this.generateAuthTokens(user.id, user.email);
      return newTokens;
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateAuthTokens(
    userId: string,
    email: string,
  ): Promise<AuthTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
      ),
    ]);

    await this.database
      .update(schema.users)
      .set({
        refresh_token: await bcrypt.hash(refreshToken, 10),
        last_login: new Date(),
      })
      .where(eq(schema.users.id, userId));

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}

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
  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AuthTokens> {
    const user = await this.database.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.refresh_token) {
      throw new UnauthorizedException(
        'No refresh token found - please login again',
      );
    }
    try {
      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refresh_token,
      );

      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateAuthTokens(user.id, user.email);
    } catch (error) {
      console.error('Refresh token error:', error);
      throw new UnauthorizedException(
        'Invalid refresh token - please login again',
      );
    }
  }

  private async generateAuthTokens(
    userId: string,
    email: string,
  ): Promise<AuthTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub: userId, email }, { expiresIn: '15m' }),
      this.jwtService.signAsync({ sub: userId, email }, { expiresIn: '7d' }),
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

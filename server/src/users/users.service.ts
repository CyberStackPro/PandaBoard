import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { Role } from './dto/create-user.dto';
import { eq } from 'drizzle-orm';
import { UpdateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async getUsers(role: Role) {
    const users = await this.database.query.users.findMany({
      with: { profile: true },
      where: (users, { eq }) => eq(users.role, role),
    });

    return users;
  }

  async getUser(id: string) {
    const userWithProfile = await this.database.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
      with: { profile: true }, // Ensure this matches your schema relation
    });
    if (id !== userWithProfile?.id) {
      throw new BadRequestException('User does not exist');
    }
    if (!userWithProfile) {
      throw new BadRequestException('User does not exist');
    }

    return userWithProfile;
  }

  async updateProfile(userId: string, profile: Partial<UpdateProfileDto>) {
    // First check if the profile exists
    const user = await this.database.query.profiles.findFirst({
      where: (profiles, { eq }) => eq(profiles.user_id, userId),
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedProfile = await this.database
      .update(schema.profiles)
      .set({
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        location: profile.location,
        age: profile.age,
        social_links: profile.social_links,
        preferences: profile.preferences,
        updated_at: new Date(),
      })
      .where(eq(schema.profiles.user_id, userId))
      .returning();

    return updatedProfile[0];
  }

  //   async updateUser(userId: string, updates: { name?: string; email?: string }) {
  //     // Check if email is being updated and if it's already in use
  //     if (updates.email) {
  //       const existingUser = await this.database.query.users.findFirst({
  //         where: (users, { eq }) => eq(users.email, updates.email),
  //       });

  //       if (existingUser && existingUser.id !== userId) {
  //         throw new BadRequestException('Email is already in use');
  //       }
  //     }

  //     const updatedUser = await this.database.transaction(async (tx) => {
  //       // Update user
  //       const result = await tx
  //         .update(schema.users)
  //         .set({
  //           ...updates,
  //           updated_at: new Date(),
  //         })
  //         .where(eq(schema.users.id, userId))
  //         .returning();

  //       // Create audit log
  //       await tx.insert(schema.auditLogs).values({
  //         user_id: userId,
  //         action: 'USER_UPDATE',
  //         table_name: 'users',
  //         changes: updates,
  //         timestamp: new Date(),
  //       });

  //       return result[0];
  //     });

  //     if (!updatedUser) {
  //       throw new NotFoundException('User not found');
  //     }

  //     return updatedUser;
  // }
}

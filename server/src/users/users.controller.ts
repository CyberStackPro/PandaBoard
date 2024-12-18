import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  UpdateProfileDto,
  updateProfileSchema,
} from './dto/create-profile.dto';
import { Role } from './dto/create-user.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

// import { CreateProfileDto } from './dto/create-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Query('role') role?: Role) {
    return this.usersService.getUsers(role as Role);
  }

  @Get(':uuid')
  async getUser(@Param('uuid', new ParseUUIDPipe()) id: string) {
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    return this.usersService.getUser(id);
  }

  @Patch('profile/:uuid')
  // @UseGuards()
  // @Throttle(5,60)
  async updateProfile(
    @Param('uuid', new ParseUUIDPipe()) userId: string,
    @Body(new ZodValidationPipe(updateProfileSchema)) request: UpdateProfileDto,
  ) {
    console.log('Request body before validation:', request);
    // console.log('Request headers:', request.headers); // Add this to check headers
    if (!userId) {
      throw new BadRequestException('ID is required');
    }
    return this.usersService.updateProfile(userId, request);
  }
}

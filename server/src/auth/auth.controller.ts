import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthResponse, AuthService } from './auth.service';
import {
  signUpSchema,
  SignInDto,
  SignUpDto,
  signInSchema,
} from './dto/create-auth.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  @UsePipes(new ZodValidationPipe(signUpSchema))
  signup(@Body() request: SignUpDto): Promise<AuthResponse> {
    return this.authServices.signup(request);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @UsePipes(new ZodValidationPipe(signInSchema))
  signin(@Body() request: SignInDto): Promise<AuthResponse> {
    return this.authServices.signin(request.email, request.password);
  }
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    await this.authServices.logout(req.user.sub);
    return { message: 'Logged out successfully' };
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body() body: { refresh_token: string }, @Request() req) {
    // console.log(req.user);
    return this.authServices.refreshTokens(req.user.sub, body.refresh_token);
  }
}

// function generateUniqueString(length: number = 12): string {
//     const characters =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let uniqueString = "";

//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * characters.length);
//       uniqueString += characters[randomIndex];
//     }

//     return uniqueString;
//   }

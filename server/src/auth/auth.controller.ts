import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  signUpSchema,
  SignInDto,
  SignUpDto,
  signInSchema,
} from './dto/create-auth.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  @UsePipes(new ZodValidationPipe(signUpSchema))
  async signup(@Body() request: SignUpDto) {
    return this.authServices.signup(request);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @UsePipes(new ZodValidationPipe(signInSchema))
  async signin(@Body() request: SignInDto) {
    return this.authServices.signin(request.email, request.password);
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

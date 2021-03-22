import { LoginDto } from '@app/api/auth/dtos/login.dto';
import { UserService } from '@app/api/user/services/user.service';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBadRequestResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import bcrypt from 'bcryptjs';

export interface JwtResponse {
  accessToken: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  // # Login Function
  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized exception response.' })
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<JwtResponse> {
    // Getting the user from the dto
    const user = await this.userService.getUserByUsername(loginDto.username);

    // If not user and If not password throw error
    if (!user || !bcrypt.compareSync(loginDto.password, user.password)) {
      throw new UnauthorizedException('Authentication failed');
    }

    // Else return jwt token for the login
    return {
      accessToken: this.jwtService.sign(
        {
          // accessing the user details from the returned jwt token
          name: user.name,
          username: user.username,
          role: user.role,
        },
        { expiresIn: 600 },
      ),
    };
  }
}

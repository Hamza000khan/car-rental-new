import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// # injectable auth guard decorator for the authentication
@Injectable()
export class AuthenticateGuard extends AuthGuard('jwt') {}

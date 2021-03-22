import { User } from '@app/api/user/models/user.model';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// # Function which handles the Jwt authentication
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // Accesing the passport class
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }
  // validating the jwt token for the credentials
  validate(
    payload: Pick<User, 'name' | 'username' | 'role'>,
  ): Pick<User, 'name' | 'username' | 'role'> {
    // Returning the extracted details from the jwt token
    return {
      name: payload.name,
      username: payload.username,
      role: payload.role,
    };
  }
}

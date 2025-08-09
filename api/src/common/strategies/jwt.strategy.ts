
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_SECRET } from '../constants/jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors( [ ( req: Request ) => req?.cookies?.jwt ] ),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET
    });
  }

  async validate(payload: any) {
    if(!payload) throw new UnauthorizedException("Token inválido ou expirado.")
    return { id: payload.id, name: payload.name, email: payload.email };
  }
}

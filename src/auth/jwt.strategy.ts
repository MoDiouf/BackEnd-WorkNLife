import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SoloSaasMHD',
    });
  }

  async validate(payload: any) {
    // Le payload contient les infos encodées dans le token
    // Par exemple : { sub: user.id_user, email: user.email }
    return { sub: payload.sub, email: payload.email, role: payload.role };
  }
}

// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {

//   constructor() {
//      console.log('JwtStrategy JWT_SECRET:', process.env.JWT_SECRET);
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: process.env.JWT_SECRET,
//     });
//   }

//   async validate(payload: any) {
//     return { 
//       userId: payload.sub, 
//       email: payload.email, 
//       role: payload.role,
//       status: payload.status 
//     };
//   }
// }




// strategies/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// auth/strategies/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cfg: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfg.get<string>('JWT_SECRET') || 'dev-fallback-secret',
    });
  }

  async validate(payload: any) {
    // ⬇️ Normalizamos: expone sub e id con el mismo valor
    return {
      sub: payload.sub,
      id:  payload.sub,
      email: payload.email,
      role: payload.role,
      status: payload.status,
    };
  }
}



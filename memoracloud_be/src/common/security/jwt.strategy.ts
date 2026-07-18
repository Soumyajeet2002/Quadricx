// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { readFileSync } from 'fs';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { join } from 'path';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     // const publicKey = process.env.JWT_PUBLIC_KEY;

//     const publicKeyPath =
//       process.env.JWT_PUBLIC_KEY_PATH ||
//       join(process.cwd(), 'keys', 'jwt-public.pem');

//     const publicKey = readFileSync(publicKeyPath, 'utf8');

//     if (!publicKey) {
//       throw new Error('JWT_PUBLIC_KEY not set');
//     }

//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: publicKey,
//       algorithms: ['RS256'],
//       issuer: process.env.JWT_ISSUER || 'sms-identity',
//       audience: process.env.JWT_AUDIENCE || 'sms-api',
//       ignoreExpiration: false,
//     });
//   }

//   async validate(payload: any) {
//     if (!payload?.sub) {
//       throw new UnauthorizedException('Invalid token');
//     }

//     // this becomes req.user
//     return {
//       userId: payload.sub,
//       mobile: payload.mobile,
//       role: payload.role,
//       roleUnqId: payload.roleUnqId,
//       societyId: payload.societyId,
//       permissions: payload.permissions ?? [],
//     };
//   }
// }


// newer version with the secure-secret-service 


import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SecureSecretsService } from '../service/secure-secrete.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private cachedPublicKey: string;

  constructor(
    private readonly secureSecretsService: SecureSecretsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
      issuer: process.env.JWT_ISSUER || 'sms-identity',
      audience: process.env.JWT_AUDIENCE || 'sms-api',
      ignoreExpiration: false,

      secretOrKeyProvider: async (request, rawJwtToken, done) => {
        try {
          // Cache the key so we don’t read file every request
          if (!this.cachedPublicKey) {
            const secretResponse =
              await this.secureSecretsService.getSecret('JWT_PUBLIC_KEY');

            if (!secretResponse?.status || !secretResponse?.content) {
              return done(
                new Error(
                  secretResponse?.message ||
                    'Failed to load JWT public key',
                )
               
              );
            }

            this.cachedPublicKey = secretResponse.content;
          }

          return done(null, this.cachedPublicKey);
        } catch (error) {
          return done(error);
        }
      },
    });
  }

  async validate(payload: any) {
    if (!payload?.sub) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      userId: payload.sub,
      mobile: payload.mobile,
      role: payload.role,
      roleUnqId: payload.roleUnqId,
      societyId: payload.societyId,
      permissions: payload.permissions ?? [],
    };
  }
}



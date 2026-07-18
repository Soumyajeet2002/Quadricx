import { Module, DynamicModule, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { EmailAuthService } from './email-auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../common/security/jwt.strategy';
import { UsersModule } from '../users/users.module';

import { OtpEntity } from './entities/otp.entity';
import { OtpMongo, OtpMongoSchema } from './entities/otp.mongo.schema';
import {
  UserMongo,
  UserMongoSchema,
} from '../users/entities/user.mongo.schema';
import { UserSqlEntity } from '../users/entities/user.sql.entity';

import { SecureSecretsService } from 'src/common/service/secure-secrete.service';

import { readFileSync } from 'fs';
import { join } from 'path';

@Module({})
export class AuthModule {
  static register(): DynamicModule {
    Logger.log(
      `AuthModule registering with DB=${process.env.DATABASE_TYPE}`,
      'AuthModule',
    );

    const imports = [
      ConfigModule,

      UsersModule.register(),

      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          const privateKey = readFileSync(
            join(process.cwd(), 'keys', 'jwt-private.pem'),
            'utf8',
          );

          return {
            privateKey,
            signOptions: {
              algorithm: 'RS256' as const,
              expiresIn:
                (configService.get<string>('JWT_EXPIRES_IN') ??
                  '3600s') as any,
            },
          };
        },
      }),
    ];

    if (process.env.DATABASE_TYPE === 'mongo') {
      imports.push(
        MongooseModule.forFeature([
          {
            name: UserMongo.name,
            schema: UserMongoSchema,
          },
          {
            name: OtpMongo.name,
            schema: OtpMongoSchema,
          },
        ]),
      );
    } else {
      imports.push(
        TypeOrmModule.forFeature([
          UserSqlEntity,
          OtpEntity,
        ]),
      );
    }

    return {
      module: AuthModule,
      imports,
      controllers: [AuthController],
      providers: [
        AuthService,
        EmailAuthService,
        JwtStrategy,
        SecureSecretsService,
      ],
      exports: [
        AuthService,
        EmailAuthService,
        JwtModule,
        TypeOrmModule
      ],
    };
  }
}
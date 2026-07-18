import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; //  Add ConfigService here
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';

import { DatabaseModule } from './config/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { MenuModule } from './menu/menu.module';
import { RoleMenuPermissionModule } from './role_menu_permission/role-menu-permission.module';
import { SecureSecretsService } from './common/service/secure-secrete.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/security/guards/roles.guard';
import { NotificationModule } from './notification/notification.module';
import { MailModule } from './email/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
      cache: true,
    }),

    // JwtModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: async (config: ConfigService) => ({
    //     secret: config.get<string>('JWT_SECRET'),
    //     signOptions: {
    //       expiresIn: config.get('JWT_EXPIRES_IN') || '3600s',
    //     },
    //   }),
    // }),

    CacheModule.register({ isGlobal: true }),

    DatabaseModule.forRoot(),
    AuthModule.register(),
    UsersModule.register(),
    RoleModule.register(),
    MenuModule.register(),
    RoleMenuPermissionModule.register(),
    NotificationModule,
    MailModule
  ],
  providers :[
    SecureSecretsService,
   
  ]
})
export class AppModule { }

import {
  Module,
  Logger,
  OnModuleInit,
  DynamicModule,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { RoleMenuPermissionController } from './role-menu-permission.controller';
import { RoleMenuPermissionService } from './role-menu-permission.service';

import { RoleMenuPermissionSqlEntity } from './entities/role_menu_permissions.entity';
import {
  RoleMenuPermissionMongo,
  RoleMenuPermissionMongoSchema,
} from './entities/role-menu-permission.mongo.schema';
import { MenuSqlEntity } from '../menu/entities/menu.sql.entity';
import { LogRoleMenuPermissionService } from './audit/role_menu_permission_audit.service';
import { RoleMenuPermissionAuditLog } from './entities/role_menu_permissions_audit.entity';

@Module({})
export class RoleMenuPermissionModule implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    Logger.log(
      `RoleMenuPermissionModule initialized. DATABASE_TYPE=${this.configService.get(
        'DATABASE_TYPE',
      )}`,
      'RoleMenuPermissionModule',
    );
  }

  static register(): DynamicModule {
    const imports = [];
    const config = new ConfigService();
    const dbType = config.get('DATABASE_TYPE');

    Logger.log(
      `Preparing RoleMenuPermissionModule with DB type: ${dbType}`,
      'RoleMenuPermissionModule',
    );

    if (dbType === 'mongo') {
      imports.push(
        MongooseModule.forFeature([
          {
            name: RoleMenuPermissionMongo.name,
            schema: RoleMenuPermissionMongoSchema,
          },
        ]),
      );
    } else {
      imports.push(
        TypeOrmModule.forFeature([RoleMenuPermissionSqlEntity,MenuSqlEntity,RoleMenuPermissionAuditLog]),
      );
    }

    return {
      module: RoleMenuPermissionModule,
      imports,
      controllers: [RoleMenuPermissionController],
      providers: [RoleMenuPermissionService, ConfigService,LogRoleMenuPermissionService],
      exports: [RoleMenuPermissionService],
    };
  }
}

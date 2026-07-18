import { Module, Logger, OnModuleInit, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleSqlEntity } from './entites/role.sql.entity';
import { RoleMongo, RoleMongoSchema } from './entites/role.mongo.schema';

@Module({})
export class RoleModule implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    Logger.log(
      `RoleModule initialized. DATABASE_TYPE=${this.configService.get('DATABASE_TYPE')}`,
      'RoleModule',
    );
  }

  static register(): DynamicModule {
    const imports = [];
    const config = new ConfigService();
    const dbType = config.get('DATABASE_TYPE');

    Logger.log(
      `Preparing RoleModule with DB type: ${dbType}`,
      'RoleModule',
    );

    if (dbType === 'mongo') {
      imports.push(
        MongooseModule.forFeature([
          { name: RoleMongo.name, schema: RoleMongoSchema },
        ]),
      );
    } else {
      imports.push(TypeOrmModule.forFeature([RoleSqlEntity]));
    }

    return {
      module: RoleModule,
      imports,
      controllers: [RoleController],
      providers: [RoleService, ConfigService],
      exports: [RoleService],
    };
  }
}

import { Module, Logger, OnModuleInit, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuSqlEntity } from './entities/menu.sql.entity';
import { MenuMongo, MenuMongoSchema } from './entities/menu.mongo.schema';

@Module({})
export class MenuModule implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    Logger.log(
      `MenuModule initialized. DATABASE_TYPE=${this.configService.get(
        'DATABASE_TYPE',
      )}`,
      'MenuModule',
    );
  }

  static register(): DynamicModule {
    const imports = [];
    const config = new ConfigService();
    const dbType = config.get('DATABASE_TYPE');

    Logger.log(
      `Preparing MenuModule with DB type: ${dbType}`,
      'MenuModule',
    );

    if (dbType === 'mongo') {
      imports.push(
        MongooseModule.forFeature([
          { name: MenuMongo.name, schema: MenuMongoSchema },
        ]),
      );
    } else {
      imports.push(TypeOrmModule.forFeature([MenuSqlEntity]));
    }

    return {
      module: MenuModule,
      imports,
      controllers: [MenuController],
      providers: [MenuService, ConfigService],
      exports: [MenuService],
    };
  }
}

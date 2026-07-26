import { Module, Logger, OnModuleInit, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { CrmController } from './crm.controller';
import { CrmService } from './crm.service';
import { CustomerEntity } from './entities/customer.entity';

@Module({})
export class CrmModule implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    Logger.log(
      `CrmModule initialized. DATABASE_TYPE=${this.configService.get(
        'DATABASE_TYPE',
      )}`,
      'CrmModule',
    );
  }

  static register(): DynamicModule {
    const imports = [];
    const config = new ConfigService();
    const dbType = config.get('DATABASE_TYPE');

    Logger.log(`Preparing CrmModule with DB type: ${dbType}`, 'CrmModule');

    if (dbType === 'mongo') {
      imports.push(MongooseModule.forFeature([]));
    } else {
      imports.push(TypeOrmModule.forFeature([CustomerEntity]));
    }

    return {
      module: CrmModule,
      imports,
      controllers: [CrmController],
      providers: [CrmService, ConfigService],
      exports: [CrmService],
    };
  }
}

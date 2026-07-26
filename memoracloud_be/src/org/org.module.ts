import { Module, Logger, OnModuleInit, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { OrgController } from './org.controller';
import { AccountService } from './org.service';

import { AccountEntity } from './entities/org.entities';
// import { AccountMongo, AccountMongoSchema } from './entities/account.mongo.schema';
import { AccountMemberEntity } from './entities/AccountMember.entities';
import { BranchEntity } from './entities/AccountBranch.entities';

@Module({})
export class OrgModule implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    Logger.log(
      `OrgModule initialized. DATABASE_TYPE=${this.configService.get(
        'DATABASE_TYPE',
      )}`,
      'OrgModule',
    );
  }

  static register(): DynamicModule {
    const imports = [];
    const config = new ConfigService();
    const dbType = config.get('DATABASE_TYPE');

    Logger.log(`Preparing OrgModule with DB type: ${dbType}`, 'OrgModule');

    if (dbType === 'mongo') {
      imports.push(
        MongooseModule.forFeature([
          // {
          //   name: AccountMongo.name,
          //   schema: AccountMongoSchema,
          // },
        ]),
      );
    } else {
      imports.push(
        TypeOrmModule.forFeature([
          AccountEntity,
          AccountMemberEntity,
          BranchEntity,
        ]),
      );
    }

    return {
      module: OrgModule,
      imports,
      controllers: [OrgController],
      providers: [AccountService, ConfigService],
      exports: [AccountService],
    };
  }
}

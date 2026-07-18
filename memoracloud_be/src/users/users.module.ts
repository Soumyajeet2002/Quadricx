import { Module, Logger, OnModuleInit, DynamicModule } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSqlEntity } from './entities/user.sql.entity';
import { UserMongo, UserMongoSchema } from './entities/user.mongo.schema';
import { OtpEntity } from '../auth/entities/otp.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserAuditService } from './audit/userAudit.service';
import { UserAuditLog } from './entities/userAudit.entity';

@Module({
  controllers: [UsersController]
})
export class UsersModule implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    Logger.log(
      `UsersModule initialized. DATABASE_TYPE=${this.configService.get('DATABASE_TYPE')}`,
      'UsersModule',
    );
  }

  static register(): DynamicModule {
    const imports = [];
    const config = new ConfigService();
    const dbType = config.get('DATABASE_TYPE');

    Logger.log(`Preparing UsersModule with DB type: ${dbType}`, 'UsersModule');

    if (dbType === 'mongo') {
      imports.push(
        MongooseModule.forFeature([
          { name: UserMongo.name, schema: UserMongoSchema },
        ]),
      );
    } else {
      imports.push(
        TypeOrmModule.forFeature([UserSqlEntity, OtpEntity,UserAuditLog]),
      );
    }

    return {
      module: UsersModule,
      imports,
      providers: [UsersService, ConfigService,UserAuditService],
      exports: [UsersService],
    };
  }
}

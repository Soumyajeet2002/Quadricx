import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    const dbType = process.env.DATABASE_TYPE;
    console.log("dbType:", dbType);

    if (dbType === 'mongo') {
      try {
        const { MongooseModule } = require('@nestjs/mongoose');
        const { UserMongo, UserMongoSchema } = require('../users/entities/user.mongo.schema');
        return {
          module: DatabaseModule,
          imports: [
            MongooseModule.forRoot(process.env.MONGO_URI),
            MongooseModule.forFeature([{ name: UserMongo.name, schema: UserMongoSchema }]),
          ],
        };
      } catch (err) {
        console.error('Mongo packages not installed!');
        throw err;
      }
    }

    if (dbType === 'postgres') {
      try {
        const { TypeOrmModule } = require('@nestjs/typeorm');
        const { UserSqlEntity } = require('../users/entities/user.sql.entity');
        return {
          module: DatabaseModule,
          imports: [
            TypeOrmModule.forRoot({
              type: 'postgres',
              url: process.env.POSTGRES_URL,
              synchronize: false,
              autoLoadEntities: true,
              entities: [UserSqlEntity],
              logging: true,
            }),
            TypeOrmModule.forFeature([UserSqlEntity]),
          ],
        };
      } catch (err) {
        console.error('Postgres packages not installed!');
        throw err;
      }
    }

    throw new Error('Unsupported DATABASE_TYPE');
  }
}

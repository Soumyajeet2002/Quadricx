import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, UsingJoinColumnOnlyOnOneSideAllowedError } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSqlEntity } from './entities/user.sql.entity';
import { UserMongo } from './entities/user.mongo.schema';
import * as bcrypt from 'bcrypt';
import { QueryUserDto } from './dto/query-user.dto';
import { userResponseMapper } from './mappers/user.response.mapper';
import { mapUserReq } from './mappers/user.request.mapper';
import { UpdateUserDto } from './dto/update-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { USER } from 'src/common/messages/specific.msg';
import { isUUID } from 'class-validator';
import { UserAuditLog } from './entities/userAudit.entity';
import { UserAuditService } from './audit/userAudit.service';
import { RoleSqlEntity } from 'src/role/entites/role.sql.entity';

@Injectable()
export class UsersService {
  private readonly isMongo = process.env.DATABASE_TYPE === 'mongo';
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly auditService: UserAuditService,
    @Optional()
    @InjectRepository(UserSqlEntity)
    private readonly sqlRepo?: Repository<UserSqlEntity>,

    @Optional()
    @InjectModel(UserMongo.name)
    private readonly mongoModel?: Model<UserMongo>,
  ) {
    if (this.isMongo && !this.mongoModel) {
      throw new Error(
        'Mongo model is not available! Did you configure DatabaseModule correctly?',
      );
    }
    if (!this.isMongo && !this.sqlRepo) {
      throw new Error(
        'Postgres repository is not available! Did you configure DatabaseModule correctly?',
      );
    }
  }

  /** Entry point for controller */
  async executeByDBType(fn: string, ...args: any[]) {
    const methodMap: Record<string, Function> = this.isMongo
      ? {
        create: this._createMongo.bind(this),
        findAll: this._findAllMongo.bind(this),
        findOne: this._findOneMongo.bind(this),
        update: this._updateMongo.bind(this),
        remove: this._removeMongo.bind(this),
      }
      : {
        create: this._createUserSql.bind(this),
        findAll: this._findAllUserSql.bind(this),
        findOne: this._findOneUserSql.bind(this),
        findByRoleCode: this._findByRoleCode.bind(this),
        update: this._updateUserSql.bind(this),
        remove: this._removeUserSql.bind(this),
      };

    const method = methodMap[fn];
    if (!method) throw new Error(`Invalid function: ${fn}`);
    return method(...args);
  }

  async findByMobile(mobile: string) {
    try {
      if (this.isMongo) {
        return this.mongoModel!.findOne({ mobile }).exec();
      }
      return this.sqlRepo!.createQueryBuilder('user')
        .leftJoin('user.role', 'role')
        .addSelect(['role.role_code'])
        .where('user.mobile = :mobile', { mobile })
        .getOne();
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string) {
    try {
      if (this.isMongo) {
        return this.mongoModel!.findOne({ email }).exec();
      }
      return this.sqlRepo!.createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .where('user.email = :email', { email })
        .andWhere('user.status = :status', { status: 1 })
        .getOne();
    } catch (error) {
      throw error;
    }
  }

  async create(mobile: string): Promise<UserSqlEntity | UserMongo> {
    try {
      if (this.isMongo) {
        const user = await this.mongoModel!.create({ mobile });
        return user.toObject(); // already a plain object
      } else {
        const user = this.sqlRepo!.create({ mobile });
        return this.sqlRepo!.save(user);
      }
    } catch (error) {
      throw error;
    }
  }

  async saveRefreshTokenHash(userId: any, token: string) {
    try {
      const hash = await bcrypt.hash(token, 10);
      if (this.isMongo) {
        return this.mongoModel!.findByIdAndUpdate(userId, {
          refresh_token_hash: hash,
        }).exec();
      }
      return this.sqlRepo!.update(userId, { refresh_token_hash: hash });
    } catch (error) {
      throw error;
    }
  }

  async removeRefreshToken(userId: string) {
    try {
      if (this.isMongo) {
        return this.mongoModel!.findByIdAndUpdate(userId, {
          refreshTokenHash: null,
        }).exec();
      }

      if (!userId) {
        console.error('❌ Missing userId in removeRefreshToken');
        return;
      }

      console.log(`🔹 Removing refresh token for User ID: ${userId}`);

      return this.sqlRepo!.update({ id: userId }, { refresh_token_hash: null });
    } catch (error) {
      throw error;
    }
  }

  async validateRefreshToken(userId: any, token: string) {
    try {
      const user = this.isMongo
        ? await this.mongoModel!.findById(userId).exec()
        : await this.sqlRepo!.findOne({ where: { id: userId } });

      if (!user || !user.refresh_token_hash) return false;
      return bcrypt.compare(token, user.refresh_token_hash);
    } catch (error) {
      throw error;
    }
  }

  async findByIdSafe(userId: string) {
    try {
      if (this.isMongo) {
        return this.mongoModel!.findById(userId).lean().exec();
      }
      return this.sqlRepo!.findOne({ where: { id: userId } });
    } catch (error) {
      throw error;
    }
  }

  /** Create user from mongo */
  async _createMongo(data: CreateUserDto) {
    const mobileExists = await this.mongoModel!.findOne({
      mobile: data.mobileNo,
      status: { $in: [0, 1] }
    });
    if (mobileExists) {
      throw new BadRequestException(USER.ERRORS.MOBILE_ALREADY_EXISTS);
    }
    try {
      let password_hash: string | undefined = undefined;
      if (data.password) {
        password_hash = await bcrypt.hash(data.password, 10);
      }
      const mappedEntity = mapUserReq({ ...data, password_hash });
      const doc = await this.mongoModel!.create({
        ...mappedEntity,
        created_by: 'admin',
      });

      return userResponseMapper(doc);
    } catch (error: any) {
      this.logger.error({
        error: error.message,
        stack: error.stack,
        payload: data,
      });
      throw new InternalServerErrorException(USER.ERRORS.CREATE_FAILED);
    }
  }

  /** Create user */
  async _createUserSql(
    data: CreateUserDto,
    req: any,
  ): Promise<UserSqlEntity | any> {
    const mobileExists = await this.sqlRepo!.findOne({
      where: { 
        mobile: data.mobileNo,
        status: In([0, 1])
     },
    });
    if (mobileExists) {
      throw new BadRequestException(USER.ERRORS.MOBILE_ALREADY_EXISTS);
    }
    try {
      let password_hash: string | undefined = undefined;
      if (data.password) {
        password_hash = await bcrypt.hash(data.password, 10);
      }
      const mappedEntity = mapUserReq({ ...data, password_hash });
      const actorId = req?.user?.userId;
      const user = this.sqlRepo!.create({
        ...mappedEntity,
        created_by: actorId && isUUID(actorId) ? actorId : null,
      });
      const savedUser = await this.sqlRepo!.save(user);

      /* Audit */
      const userId = (await savedUser).id
      await this.auditService.logUserAction({
        userId: userId,
        action: 'CREATE',
        newData: savedUser,
        changedBy: req.user?.userId,
        ipAddress: req.ip ?? null,
        platform: req.headers['user-agent'] ?? null,
      });

      return { message: USER.SUCCESS.USER_CREATED, userId: userId  };
    } catch (error: any) {
      this.logger.error({
        error: error.message,
        stack: error.stack,
        payload: data,
      });
      throw new InternalServerErrorException(USER.ERRORS.CREATE_FAILED);
    }
  }

  /** Get Users with Pagination & Filter (Mongo) */
  async _findAllMongo(query: QueryUserDto) {
    try {
      const hasQuery =
        query.search ||
        query.page ||
        query.limit ||
        query.sortBy ||
        query.sortOrder;

      const match: any = {};

      // Search
      if (query.search) {
        match.name = { $regex: query.search, $options: 'i' };
      }

      // Mongo LEFT JOIN
      const lookupStage = {
        $lookup: {
          from: 'roles', // roles collection
          localField: 'role_unq_id', // users field
          foreignField: 'role_unq_id', // roles field
          as: 'role',
        },
      };

      // Flatten role array (LEFT JOIN behavior)
      const unwindStage = {
        $unwind: {
          path: '$role',
          preserveNullAndEmptyArrays: true,
        },
      };

      // Case 1: No query params → return ALL
      if (!hasQuery) {
        const data = await this.mongoModel!.aggregate([
          { $match: match },
          lookupStage,
          unwindStage,
        ]).exec();

        return {
          page: null,
          limit: null,
          total: data.length,
          totalPages: 1,
          data: data.map(userResponseMapper),
        };
      }

      // Case 2: Pagination
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const sortBy = query.sortBy || 'createdAt';
      const sortOrder = query.sortOrder === 'ASC' ? 1 : -1;
      const skip = (page - 1) * limit;

      const [data, totalResult] = await Promise.all([
        this.mongoModel!.aggregate([
          { $match: match },
          lookupStage,
          unwindStage,
          { $sort: { [sortBy]: sortOrder } },
          { $skip: skip },
          { $limit: limit },
        ]).exec(),

        this.mongoModel!.aggregate([{ $match: match }, { $count: 'total' }]),
      ]);

      const total = totalResult[0]?.total || 0;

      return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: data.map(userResponseMapper),
      };
    } catch (error: any) {
      this.logger.error({
        error: error.message,
        stack: error.stack,
        payload: query,
      });
      throw new InternalServerErrorException(USER.ERRORS.FETCH_FAILED);
    }
  }

  /** Get Users with Pagination & Filter */
  async _findAllUserSql(query: QueryUserDto) {
    try {
      const hasQuery =
        query.search ||
        query.page ||
        query.limit ||
        query.sortBy ||
        query.sortOrder;

      const queryBuilder = this.sqlRepo!.createQueryBuilder(
        'users',
      ).leftJoinAndSelect('users.role', 'role')
        .where('users.status != :deletedStatus', { deletedStatus: 2 });

      if (query.search) {
        queryBuilder.andWhere('users.name ILIKE :s', {
          s: `%${query.search}%`,
        });
      }

      // Case 1: No query params → return ALL
      if (!hasQuery) {
        const data = await queryBuilder.getMany();

        return {
          page: null,
          limit: null,
          total: data.length,
          totalPages: 1,
          data: data.map(userResponseMapper),
          message: USER.SUCCESS.USERS_FETCHED,
        };
      }

      // Case 2: Query params present → paginate
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const sortBy = query.sortBy || 'DESC';
      const sortOrder = query.sortOrder || 'DESC';
      const skip = (page - 1) * limit;

      queryBuilder
        .orderBy(`users.${sortBy}`, sortOrder as 'ASC' | 'DESC')
        .skip(skip)
        .take(limit);

      const [data, total] = await queryBuilder.getManyAndCount();

      return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: data.map(userResponseMapper),
        message: USER.SUCCESS.USERS_FETCHED,
      };
    } catch (error: any) {
      this.logger.error({
        error: error.message,
        stack: error.stack,
        payload: query,
      });
      throw new InternalServerErrorException(USER.ERRORS.FETCH_FAILED);
    }
  }

  /** Find one user by id (Mongo) */
  async _findOneMongo(id: string) {
    try {
      const user = await this.mongoModel!.findById(id).exec();
      if (!user) {
        throw new NotFoundException(USER.ERRORS.USER_NOT_FOUND);
      }
      return userResponseMapper(user);
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error({
        error: error.message,
        stack: error.stack,
        payload: id,
      });
      throw new InternalServerErrorException(USER.ERRORS.FETCH_ONE_FAILED);
    }
  }

  /** Find one user by id */
  async _findOneUserSql(id: string) {
    if (!isUUID(id)) {
      console.log('test--')
      throw new BadRequestException(USER.ERRORS.INVALID_USER_ID);
    }
    try {
      const user = await this.sqlRepo!.createQueryBuilder('users')
        .leftJoinAndSelect('users.role', 'role')
        .where('users.id = :id', { id })
        .andWhere('users.status != :deletedStatus', { deletedStatus: 2 })
        .getOne();
      if (!user) {
        throw new NotFoundException(USER.ERRORS.USER_NOT_FOUND);
      }
      let data = userResponseMapper(user);
      return { ...data, message: USER.SUCCESS.USER_FETCHED };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error({
        error: error.message,
        stack: error.stack,
        payload: id,
      });
      throw new InternalServerErrorException(USER.ERRORS.FETCH_ONE_FAILED);
    }
  }

  /** Update user from mongo */
  async _updateMongo(id: string, data: UpdateUserDto) {
    try {
      //User should not update these values.
      delete (data as any).createdBy;
      delete (data as any).createdAt;

      const mappedEntity = mapUserReq(data);
      const updatedDoc = await this.mongoModel!.findByIdAndUpdate(
        id,
        { $set: mappedEntity },
        { new: true },
      );

      if (!updatedDoc) {
        throw new NotFoundException(USER.ERRORS.USER_NOT_FOUND);
      }

      return userResponseMapper(updatedDoc);
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error({
        error: error.message,
        stack: error.stack,
        payload: id,
        data,
      });
      throw new InternalServerErrorException(USER.ERRORS.UPDATE_FAILED);
    }
  }

  /** Update user */
  async _updateUserSql(id: string, data: UpdateUserDto, req: any) {
    try {
      //Should not update these values.
      delete (data as any).createdBy;
      delete (data as any).createdAt;

      const mappedEntity = mapUserReq(data);

      await this._findOneUserSql(id);

      /* ========= GET OLD DATA ========= */
      const oldData = await this._findOneUserSql(id);

      const actorId = req?.user?.userId;
      await this.sqlRepo!.update(id, {
        ...mappedEntity,
        updated_by: actorId && isUUID(actorId) ? actorId : null,
      });

      /* ========= GET NEW DATA ========= */
      const updatedData = await this._findOneUserSql(id);

      /* ========= AUDIT LOG ========= */
      await this.auditService.logUserAction({
        userId: id,
        action: 'UPDATE',
        oldData,
        newData: updatedData,
        changedBy: req?.user.userId,
        // If you later have req, you can replace this
        ipAddress: req?.ip ?? null,
        platform: req?.headers['user-agent'] ?? null,
      });

      return { message: USER.SUCCESS.USER_UPDATED };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error({
        error: error.message,
        stack: error.stack,
        payload: id,
        data,
      });

      throw new InternalServerErrorException(USER.ERRORS.UPDATE_FAILED);
    }
  }

  /** Delete user from mongo */
  async _removeMongo(id: string) {
    try {
      const doc = await this.mongoModel!.findByIdAndUpdate(
        id,
        { $set: { status: 2 } },
        { new: false },
      );

      if (!doc) {
        throw new NotFoundException(USER.ERRORS.USER_NOT_FOUND);
      }
      return { message: USER.SUCCESS.USER_DELETED };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      // Unexpected / DB errors → log
      this.logger.error({
        error: error.message,
        stack: error.stack,
        payload: id,
      });

      throw new InternalServerErrorException(USER.ERRORS.DELETE_FAILED);
    }
  }

  /** Delete user */
  async _removeUserSql(id: string, req: any) {
    try {
      // Get old data (before delete)
      const oldData = await this._findOneUserSql(id);

      await this.sqlRepo!.update({ id }, { status: 2 });

      // Insert audit log 
      await this.auditService.logUserAction({
        userId: id,
        action: 'DELETE',
        oldData,
        newData: null,
        changedBy: req?.user.userId,
        ipAddress: req?.ip ?? null,
        platform: req?.headers['user-agent'] ?? null,
      });

      return { message: USER.SUCCESS.USER_DELETED };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error({
        error: error.message,
        stack: error.stack,
        payload: id,
      });

      throw new InternalServerErrorException(USER.ERRORS.DELETE_FAILED);
    }
  }


  /** Find one user by number */
  async _findUserByMobNumber(mobNumber: string) {
    
    if (!mobNumber) {
      throw new BadRequestException('Mobile number is required');
    }

    const user = await this.sqlRepo!
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.mobile = :mobNumber', { mobNumber })
      .andWhere('user.status = :status', { status: 1 })
      .getOne();

    // Check if user exists
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check role exists
    if (!user.role) {
      console.log('User has no role assigned')
      throw new ForbiddenException('User has no role assigned');
    }

    // Check if role is admin
    if (user.role.role_code !== 3) {
      console.log('User is not an SOCIETY ADMIN')
      throw new ForbiddenException('User is not an SOCIETY ADMIN');
    }
    //  const finaldata = userResponseMapper(user);

    // return {
    //   data: finaldata,
    //   message: USER.SUCCESS.USER_FETCHED
    // };

    return {
      userId: user.id,
      userName: user.name,
      roleId: user.role.role_unq_id,
      roleCode: user.role.role_code,
      roleName: user.role.role_name,
      email: user.email,
    };
  }

  async _findByRoleCode(roleCode: number) {
    try {
      const users = await this.sqlRepo!
        .createQueryBuilder('u')
        .innerJoin(RoleSqlEntity, 'r', 'r.role_unq_id = u.role_unq_id')
        .select([
          'u.id AS id',
          'u.name AS name'
        ])
        .where('r.role_code = :roleCode', { roleCode })
        .andWhere('r.status = 1')
        .andWhere('u.status = 1')
        .getRawMany();

      return {
        message: USER.SUCCESS.USERS_FETCHED,
        data: users,
      }
    }
    catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error({
        error: error.message,
        stack: error.stack,
        payload: roleCode,
      });

      throw new InternalServerErrorException(USER.ERRORS.FETCH_FAILED);
    }
  }
}

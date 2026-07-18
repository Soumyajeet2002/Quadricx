import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleSqlEntity } from './entites/role.sql.entity';
import { RoleMongo } from './entites/role.mongo.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { toRoleSql, toRoleMongo } from './mappers/role.request.mapper';
import { roleResponseMapper } from './mappers/role.response.mapper';

@Injectable()
export class RoleService {
    private isMongo = process.env.DATABASE_TYPE === 'mongo';

    constructor(
        @Optional()
        @InjectRepository(RoleSqlEntity)
        private readonly sqlRepo?: Repository<RoleSqlEntity>,

        @Optional()
        @InjectModel(RoleMongo.name)
        private readonly mongoModel?: Model<RoleMongo>,
    ) { }

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
                create: this._createSql.bind(this),
                findAll: this._findAllSql.bind(this),
                findOne: this._findOneSql.bind(this),
                update: this._updateSql.bind(this),
                remove: this._removeSql.bind(this),
            };

        const method = methodMap[fn];
        if (!method) throw new Error(`Invalid function: ${fn}`);
        return method(...args);
    }


    /** Create Role */
    private async _createSql(dto: CreateRoleDto,req: any) {
        const mappedEntity = toRoleSql(dto);
        const entity = this.sqlRepo!.create({ ...mappedEntity, status: mappedEntity.status ?? 1,created_by: req?.user?.userId });
        const saved = await this.sqlRepo!.save(entity);
        return { message: "Role created successfully" };
    }

    private async _createMongo(dto: CreateRoleDto) {
        const mappedEntity = toRoleMongo(dto);
        const doc = await this.mongoModel!.create({ ...mappedEntity, status: mappedEntity.status ?? 1 });
        return { message: "Role created successfully" };
    }

    /** Get Roles with Pagination & Filter */
    private async _findAllSql(query: QueryRoleDto) {
        const hasQuery =
            query.search ||
            query.page ||
            query.limit ||
            query.sortBy ||
            query.sortOrder;

        const qb = this.sqlRepo!.createQueryBuilder('role');
        qb.where('role.status != :deletedStatus', { deletedStatus: 2 });
        if (query.search) {
            qb.andWhere('role.role_name ILIKE :s', {
                s: `%${query.search}%`,
            });
        }

        // 🔥 Case 1: No query params → return ALL
        if (!hasQuery) {
            const data = await qb.getMany();

            return {
                page: null,
                limit: null,
                total: data.length,
                totalPages: 1,
                data: data.map(roleResponseMapper),
            };
        }

        // 🔥 Case 2: Query params present → paginate
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const sortBy = query.sortBy || 'created_at';
        const sortOrder = query.sortOrder || 'DESC';
        const skip = (page - 1) * limit;

        qb.orderBy(`role.${sortBy}`, sortOrder as 'ASC' | 'DESC')
            .skip(skip)
            .take(limit);

        const [data, total] = await qb.getManyAndCount();

        return {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: data.map(roleResponseMapper),
        };
    }


    private async _findAllMongo(query: QueryRoleDto) {
        const hasQuery =
            query.search ||
            query.page ||
            query.limit ||
            query.sortBy ||
            query.sortOrder;

        const filter: any = {};

        if (query.search) {
            filter.role_name = { $regex: query.search, $options: 'i' };
        }

        // 🔥 Case 1: No query params → return ALL
        if (!hasQuery) {
            const data = await this.mongoModel!
                .find(filter)
                .lean();

            return {
                page: null,
                limit: null,
                total: data.length,
                totalPages: 1,
                records: data.map(roleResponseMapper),
            };
        }

        // 🔥 Case 2: Query params present → paginate
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const sortBy = query.sortBy || 'created_at';
        const sortOrder = query.sortOrder === 'ASC' ? 1 : -1;
        const skip = (page - 1) * limit;

        const data = await this.mongoModel!
            .find(filter)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await this.mongoModel!.countDocuments(filter);

        return {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            records: data.map(roleResponseMapper),
        };
    }


    /** Find One Role */
    // private async _findOneSql(id: string) {
    //     const role = await this.sqlRepo!.findOne({ where: { role_unq_id: id } });
    //     if (!role) throw new NotFoundException('Role not found');
    //     return roleResponseMapper(role);
    // }

    private async _findOneSql(id: string) {
        const role = await this.sqlRepo!
            .createQueryBuilder('role')
            .where('role.role_unq_id = :id', { id })
            .andWhere('role.status != :deleted', { deleted: 2 })
            .getOne();

        if (!role) throw new NotFoundException('Role not found');
        return roleResponseMapper(role);
    }

    private async _findOneMongo(id: string) {
        const role = await this.mongoModel!.findById(id).lean().exec();
        if (!role) throw new NotFoundException('Role not found');
        return roleResponseMapper(role);
    }

    /** Update Role */
    private async _updateSql(id: string, dto: UpdateRoleDto,req: any) {
        const mappedEntity = toRoleSql(dto);
        await this._findOneSql(id);
        await this.sqlRepo!.update({ role_unq_id: id }, { ...mappedEntity,updated_by: req?.user?.userId,updated_at: new Date() });
        return { message: 'Role updated successfully' };
    }

    private async _updateMongo(id: string, dto: UpdateRoleDto) {
        const mappedEntity = toRoleMongo(dto);
        await this._findOneMongo(id);
        await this.mongoModel!.findByIdAndUpdate(id, mappedEntity).exec();
        return this._findOneMongo(id);
    }

    /** Delete Role (soft delete) */
    private async _removeSql(id: string,req: any) {
        await this._findOneSql(id);
        await this.sqlRepo!.update({ role_unq_id: id }, { status: 2,updated_by: req?.user?.userId,updated_at: new Date() });
        return { message: 'Role marked as deleted' };
    }

    private async _removeMongo(id: string) {
        await this._findOneMongo(id);
        await this.mongoModel!.findByIdAndUpdate(id, { status: 2 }).exec();
        return { message: 'Role marked as deleted' };
    }
}

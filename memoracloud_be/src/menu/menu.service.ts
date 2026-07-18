import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MenuSqlEntity } from './entities/menu.sql.entity';
import { MenuMongo } from './entities/menu.mongo.schema';

import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
import { toMenuSql, toMenuMongo } from './mappers/menu.request.mapper';
import { menuResponseMapper } from './mappers/menu.response.mapper';
import { buildMenuTree } from '../common/utils/common.util';

@Injectable()
export class MenuService {
  private isMongo = process.env.DATABASE_TYPE === 'mongo';

  constructor(
    @Optional()
    @InjectRepository(MenuSqlEntity)
    private readonly sqlRepo?: Repository<MenuSqlEntity>,

    @Optional()
    @InjectModel(MenuMongo.name)
    private readonly mongoModel?: Model<MenuMongo>,
    
  ) {}

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

  /* ---------- CREATE ---------- */
  private async _createSql(dto: CreateMenuDto,req: any) {
    const mappedEntity = toMenuSql(dto); // use request mapper
    const entity = this.sqlRepo!.create({
      ...mappedEntity,
      status: mappedEntity.status ?? 1,
      created_by: req?.user?.userId || 'admin', // optionally use auth user
    });

    const saved = await this.sqlRepo!.save(entity);
    return { message: 'Menu created successfully' };
  }

  private async _createMongo(dto: CreateMenuDto) {
    const mappedDoc = toMenuMongo(dto); // use request mapper
    const doc = await this.mongoModel!.create({
      ...mappedDoc,
      status: mappedDoc.status ?? 1,
      created_by: 'admin',
    });
    return menuResponseMapper(doc);
  }

  /* ---------- FIND ALL WITH PAGINATION ---------- */
  // private async _findAllSql(query: QueryMenuDto) {
  //   const qb = this.sqlRepo!.createQueryBuilder('menu');

  //   if (query.search) {
  //     qb.andWhere('menu.menu_name ILIKE :s', {
  //       s: `%${query.search}%`,
  //     });
  //   }

  //   if (query.page || query.limit || query.sortBy || query.sortOrder) {
  //     const page = Number(query.page) || 1;
  //     const limit = Number(query.limit) || 10;
  //     const sortBy = query.sortBy || 'created_at';
  //     const sortOrder = query.sortOrder || 'DESC';

  //     qb.orderBy(`menu.${sortBy}`, sortOrder as 'ASC' | 'DESC')
  //       .skip((page - 1) * limit)
  //       .take(limit);

  //     const [data, total] = await qb.getManyAndCount();

  //     return {
  //       page,
  //       limit,
  //       total,
  //       totalPages: Math.ceil(total / limit),
  //       data: data.map(menuResponseMapper),
  //     };
  //   }

  //   // 🔥 No query params → return ALL
  //   const data = await qb.getMany();

  //   return {
  //     page: null,
  //     limit: null,
  //     total: data.length,
  //     totalPages: 1,
  //     data: data.map(menuResponseMapper),
  //   };
  // }

  // test nested //

private async _findAllSql(query: QueryMenuDto) {
  const qb = this.sqlRepo!.createQueryBuilder('menu');

  // Search
  if (query.search) {
    qb.andWhere('menu.menu_name ILIKE :s', {
      s: `%${query.search}%`,
    });
  }

  //  Only parent menus (menuLevel = 1)
  if (query.onlyParent === '1') {
    qb.andWhere('menu.menu_level = :level', { level: 1 });
  }

  let data: any[] = [];
  let total = 0;
  let page: number | null = null;
  let limit: number | null = null;

  //  Pagination / Sorting
  if (query.page || query.limit || query.sortBy || query.sortOrder) {
    page = Number(query.page) || 1;
    limit = Number(query.limit) || 10;
    const sortBy = query.sortBy || 'created_at';
    const sortOrder = query.sortOrder || 'DESC';

    qb.orderBy(`menu.${sortBy}`, sortOrder as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [result, count] = await qb.getManyAndCount();
  console.log(result,'---------u')
    data = result.map(menuResponseMapper);
   
    total = count;
  } else {
    //  No query params → return ALL
    const result = await qb.getMany();
      console.log(result,'---------')
    data = result.map(menuResponseMapper);

  
    total = data.length;
  }

  //  Build nested tree ONLY when required
  const finalData =
    query.onlyParent === '1' ? data : buildMenuTree(data);

  return {
    page,
    limit,
    total,
    totalPages: limit ? Math.ceil(total / limit) : 1,
    data: finalData,
  };
}


  private async _findAllMongo(query: QueryMenuDto) {
    const hasQuery =
      query.search ||
      query.page ||
      query.limit ||
      query.sortBy ||
      query.sortOrder;

    const filter: any = {};

    if (query.search) {
      filter.menu_name = { $regex: query.search, $options: 'i' };
    }

    //  Case 1: No query params → return ALL
    if (!hasQuery) {
      const data = await this.mongoModel!
        .find(filter)
        .lean();

      return {
        page: null,
        limit: null,
        total: data.length,
        totalPages: 1,
        data: data.map(menuResponseMapper),
      };
    }

    //  Case 2: Query params present → paginate
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
      data: data.map(menuResponseMapper),
    };
  }


  /* ---------- FIND ONE ---------- */
  // private async _findOneSql(id: string) {
  //   const menu = await this.sqlRepo!.findOne({ where: { menu_unq_id: id } });
  //   if (!menu) throw new NotFoundException('Menu not found');
  //   return menuResponseMapper(menu);
  // }

private async _findOneSql(id: string) {
  //  Fetch requested menu
  const parentEntity = await this.sqlRepo!.findOne({
    where: { menu_unq_id: id },
  });

  if (!parentEntity) {
    throw new NotFoundException('Menu not found');
  }

  //  Fetch all menus
  const allEntities = await this.sqlRepo!.find();

  //  Map & remove nulls
  const menus = allEntities
    .map(menuResponseMapper)
    .filter(
      (menu): menu is NonNullable<typeof menu> => menu !== null,
    );

  //  Build lookup map
  const menuMap = new Map<string, any>();
  menus.forEach(menu => {
    menuMap.set(menu.menuCode, { ...menu, children: [] });
  });

  // Attach children
  menus.forEach(menu => {
    if (
      menu.parentMenu &&
      menu.parentMenu !== menu.menuCode
    ) {
      const parent = menuMap.get(menu.parentMenu);
      if (parent) {
        parent.children.push(menuMap.get(menu.menuCode));
      }
    }
  });

  return menuMap.get(String(parentEntity.menu_code));
}



  private async _findOneMongo(id: string) {
    const menu = await this.mongoModel!.findById(id).lean().exec();
    if (!menu) throw new NotFoundException('Menu not found');
    return menuResponseMapper(menu);
  }

  /* ---------- UPDATE ---------- */
  private async _updateSql(id: string, dto: UpdateMenuDto,req: any) {
    await this._findOneSql(id);
    const mappedEntity = toMenuSql(dto); // map DTO to SQL
    await this.sqlRepo!.update({ menu_unq_id: id }, { ...mappedEntity,updated_by: req?.user?.userId,updated_at: new Date() });
    return { message: 'Menu updated successfully' };
  }

  private async _updateMongo(id: string, dto: UpdateMenuDto) {
    await this._findOneMongo(id);
    const mappedDoc = toMenuMongo(dto); // map DTO to Mongo
    await this.mongoModel!.findByIdAndUpdate(id, mappedDoc).exec();
    return this._findOneMongo(id);
  }

  /* ---------- SOFT DELETE ---------- */
  private async _removeSql(id: string,req: any) {
    await this._findOneSql(id);
    await this.sqlRepo!.update({ menu_unq_id: id }, { status: 2,updated_by: req?.user?.userId,updated_at: new Date() });
    return { message: 'Menu marked as deleted' };
  }

  private async _removeMongo(id: string) {
    await this._findOneMongo(id);
    await this.mongoModel!.findByIdAndUpdate(id, { status: 2 }).exec();
    return { message: 'Menu marked as deleted' };
  }
}

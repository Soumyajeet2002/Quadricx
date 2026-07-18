import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { RoleMenuPermissionSqlEntity } from './entities/role_menu_permissions.entity';
import { RoleMenuPermissionMongo } from './entities/role-menu-permission.mongo.schema';

import {
  toRoleMenuPermissionSql,
  toRoleMenuPermissionMongo,
} from './mappers/role-menu-permission.request.mapper';

import { roleMenuPermissionMapper } from './mappers/role-menu-permission.response.mapper';
import { MenuSqlEntity } from '../menu/entities/menu.sql.entity';
import { normalizeRoleMenuPermissions } from './utils/role-menu-permission.normalize';
import {
  buildMenuTree,
  MenuWithPermission,
} from './utils/role-menu-permission.tree';
import { LogRoleMenuPermissionService } from './audit/role_menu_permission_audit.service';

@Injectable()
export class RoleMenuPermissionService {
  private isMongo = process.env.DATABASE_TYPE === 'mongo';

  constructor(
    private readonly auditService:LogRoleMenuPermissionService,
    @Optional()
    @InjectRepository(RoleMenuPermissionSqlEntity)
    private readonly sqlRepo?: Repository<RoleMenuPermissionSqlEntity>,

    @Optional()
    @InjectRepository(MenuSqlEntity)
    private readonly sqlMenuRepo?: Repository<MenuSqlEntity>,

    @Optional()
    @InjectModel(RoleMenuPermissionMongo.name)
    private readonly mongoModel?: Model<RoleMenuPermissionMongo>,
  ) {}

  /** -------- Entry Point (Controller → Service) -------- */
  async executeByDBType(fn: string, ...args: any[]) {
    const methodMap: Record<string, Function> = this.isMongo
      ? {
          create: this._createOrUpdateMongo.bind(this),
          //update: this._updateMongo.bind(this),
          getByRoleId: this._getByRoleIdMongo.bind(this),
        }
      : {
          create: this._createOrUpdateSql.bind(this),
          //update: this._updateSql.bind(this),
          getByRoleId: this._getByRoleIdSql.bind(this),
        };

    const method = methodMap[fn];
    if (!method) throw new Error(`Invalid function: ${fn}`);

    return method(...args);
  }

  /* ===================== CREATE ===================== */

  /* ---------- POSTGRES ---------- */
  // private async _createOrUpdateSql(dto: any) {
  //     const rows = normalizeRoleMenuPermissions(dto.roleUnqId, dto.menus);

  //     for (const row of rows) {
  //         const mapped = toRoleMenuPermissionSql(row);

  //         const existing = await this.sqlRepo!.findOne({
  //             where: {
  //                 role_unq_id: mapped.role_unq_id,
  //                 menu_unq_id: mapped.menu_unq_id,
  //             },
  //         });

  //         if (existing) {
  //             await this.sqlRepo!.update(existing.id, mapped);
  //         } else {
  //             await this.sqlRepo!.save(this.sqlRepo!.create(mapped));
  //         }
  //     }

  //     return { message: 'Permissions saved successfully' };
  // }


    // with audit
  private async _createOrUpdateSql(dto: any, req?: any) {
    const rows = normalizeRoleMenuPermissions(dto.roleUnqId, dto.menus);

    for (const row of rows) {
      const mapped = toRoleMenuPermissionSql(row);

      const existing : any = await this.sqlRepo!.findOne({
        where: {
          role_unq_id: mapped.role_unq_id,
          menu_unq_id: mapped.menu_unq_id,
        },
      });

      // ========================
      // UPDATE CASE
      // ========================
      if (existing) {
        const oldData = { ...existing };

        // Existing logic
        await this.sqlRepo!.update(existing.id, mapped);

        const newData = await this.sqlRepo!.findOne({
          where: { id: existing.id },
        });

        // Audit log 
        await this.auditService.logRoleMenuPermissionAction({
          permissionId: existing.id,

          action: 'UPDATE',

          oldData,
          newData,

          changedBy: req?.user?.userId || null,
          ipAddress: req?.ip ?? null,
          platform: req?.headers?.['user-agent'] ?? null,
        });
      }

      // ========================
      // CREATE CASE
      // ========================
      else {
        // Existing logic
        const created = await this.sqlRepo!.save(this.sqlRepo!.create(mapped));

        // Audit log 
        await this.auditService.logRoleMenuPermissionAction({
        
          permissionId: created.id,

          action: 'CREATE',

          oldData: null,
          newData: created,

          changedBy: req?.user?.userId || null,
          ipAddress: req?.ip ?? null,
          platform: req?.headers?.['user-agent'] ?? null,
        });
      }
    }

    // Existing return 
    return { message: 'Permissions saved successfully' };
  }

  /* ---------- MONGO ---------- */
  private async _createOrUpdateMongo(dto: any) {
    const rows = normalizeRoleMenuPermissions(dto.roleUnqId, dto.menus);

    for (const row of rows) {
      const mapped = toRoleMenuPermissionMongo(row);

      await this.mongoModel!.updateOne(
        {
          role_unq_id: mapped.role_unq_id,
          menu_unq_id: mapped.menu_unq_id,
        },
        { $set: mapped },
        { upsert: true },
      );
    }

    return { message: 'Permissions saved successfully' };
  }

  // /* ================= SQL ================= */

  // private async _createOrUpdateSql(dto: CreateRoleMenuPermissionDto) {
  //     const normalized = this.normalizePermissions(dto.menus);
  //     const flat = this.flattenMenus(dto.roleUnqId, normalized);

  //     for (const perm of flat) {
  //         const existing = await this.sqlRepo!.findOne({
  //             where: {
  //                 role_unq_id: perm.role_unq_id,
  //                 menu_unq_id: perm.menu_unq_id,
  //             },
  //         });

  //         if (existing) {
  //             await this.sqlRepo!.update(existing.id, perm);
  //         } else {
  //             await this.sqlRepo!.save(this.sqlRepo!.create(perm));
  //         }
  //     }

  //     return { message: 'Role menu permissions saved (PostgreSQL)' };
  // }

  // /* ================= MONGO ================= */

  // private async _createOrUpdateMongo(dto: CreateRoleMenuPermissionDto) {
  //     const normalized = this.normalizePermissions(dto.menus);
  //     const flat = this.flattenMenus(dto.roleUnqId, normalized);

  //     for (const perm of flat) {
  //         await this.mongoModel!.updateOne(
  //             {
  //                 role_unq_id: perm.role_unq_id,
  //                 menu_unq_id: perm.menu_unq_id,
  //             },
  //             { $set: perm },
  //             { upsert: true },
  //         );
  //     }

  //     return { message: 'Role menu permissions saved (MongoDB)' };
  // }

  // /* ================= PERMISSION RULE ================= */

  // private normalizePermissions(
  //     menus: MenuPermissionNodeDto[],
  //     parentPerm?: PermissionDto,
  // ): MenuPermissionNodeDto[] {
  //     return menus.map(menu => {
  //         let effective = { ...menu.permissions };

  //         // 🔒 Parent READ-ONLY → children READ-ONLY
  //         if (
  //             parentPerm &&
  //             parentPerm.canRead &&
  //             !parentPerm.canWrite &&
  //             !parentPerm.canDelete &&
  //             !parentPerm.canApprove
  //         ) {
  //             effective = {
  //                 canRead: true,
  //                 canWrite: false,
  //                 canDelete: false,
  //                 canApprove: false,
  //             };
  //         }

  //         return {
  //             ...menu,
  //             permissions: effective,
  //             children: menu.children
  //                 ? this.normalizePermissions(menu.children, effective)
  //                 : undefined,
  //         };
  //     });
  // }

  // /* ================= TREE → FLAT ================= */

  // private flattenMenus(
  //     roleUnqId: string,
  //     menus: MenuPermissionNodeDto[],
  //     result: any[] = [],
  // ) {
  //     for (const menu of menus) {
  //         result.push({
  //             role_unq_id: roleUnqId,
  //             menu_unq_id: menu.menuUnqId,
  //             can_read: menu.permissions.canRead,
  //             can_write: menu.permissions.canWrite,
  //             can_delete: menu.permissions.canDelete,
  //             can_approve: menu.permissions.canApprove,
  //         });

  //         if (menu.children?.length) {
  //             this.flattenMenus(roleUnqId, menu.children, result);
  //         }
  //     }
  //     return result;
  // }

  /* ===================== GET BY ROLE ===================== */

  private async _getByRoleIdSql(roleUnqId: string) {
    const rows = await this.sqlMenuRepo!.createQueryBuilder('menu')
      .leftJoin(
        RoleMenuPermissionSqlEntity,
        'perm',
        `
        perm.menu_unq_id = menu.menu_unq_id
        AND perm.role_unq_id = :roleUnqId
      `,
        { roleUnqId },
      )
      .where('menu.status = :status', { status: 1 })
      .orderBy('menu.menu_seq', 'ASC')
      .select([
        'menu.menu_unq_id AS menu_id',
        'menu.menu_code AS menu_code',
        'menu.menu_name AS menu_name',
        'menu.menu_type AS menu_type', //newly added
        'menu.menu_desc AS menu_desc',
        'menu.parent_menu AS parent_menu',
        'menu.menu_level AS menu_level',
        'menu.menu_seq AS menu_seq',
        'menu.menu_url AS menu_url',
        'menu.menu_icon AS menu_icon',

        'COALESCE(perm.can_read, false) AS can_read',
        'COALESCE(perm.can_write, false) AS can_write',
        'COALESCE(perm.can_delete, false) AS can_delete',
        'COALESCE(perm.can_approve, false) AS can_approve',
      ])
      .getRawMany();

    const flatList = rows.map((row) => ({
      menuId: row.menu_id,
      menuCode: Number(row.menu_code),
      menuName: row.menu_name,
      menuDesc: row.menu_desc,
      parentMenu: Number(row.parent_menu),
      menuLevel: row.menu_level,
      menuSeq: row.menu_seq,
      menuType: row.menu_type,
      menuUrl: row.menu_url,
      menuIcon: row.menu_icon,
      permissions: {
        canRead: row.can_read,
        canWrite: row.can_write,
        canDelete: row.can_delete,
        canApprove: row.can_approve,
      },
    }));

    return buildMenuTree(flatList);
  }

  private async _getByRoleIdMongo(roleUnqId: string) {
    const flatData: MenuWithPermission[] = await this.mongoModel!.aggregate([
      { $match: { status: 1 } },

      {
        $lookup: {
          from: 'role_menu_permissions',
          let: { menuId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$menu_unq_id', '$$menuId'] },
                    { $eq: ['$role_unq_id', roleUnqId] },
                  ],
                },
              },
            },
          ],
          as: 'permission',
        },
      },

      {
        $addFields: {
          permission: { $arrayElemAt: ['$permission', 0] },
        },
      },

      {
        $project: {
          menuId: '$_id',
          menuCode: '$menu_code',
          menuName: '$menu_name',
          menuDesc: '$menu_desc',
          parentMenu: '$parent_menu',
          menuLevel: '$menu_level',
          menuSeq: '$menu_seq',
          menuUrl: '$menu_url',
          menuIcon: '$menu_icon',
          permissions: {
            canRead: { $ifNull: ['$permission.can_read', false] },
            canWrite: { $ifNull: ['$permission.can_write', false] },
            canDelete: { $ifNull: ['$permission.can_delete', false] },
            canApprove: { $ifNull: ['$permission.can_approve', false] },
          },
        },
      },

      { $sort: { menu_seq: 1 } },
    ]);

    // Build tree with read-only propagation
    const tree = buildMenuTree(flatData);
    return tree;
  }

  /* ===================== PRIVATE HELPERS ===================== */

  private async _findByIdSql(id: string) {
    const record = await this.sqlRepo!.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Permission not found');
    return roleMenuPermissionMapper(record);
  }
}

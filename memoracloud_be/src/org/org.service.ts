import { Injectable, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not, DataSource } from 'typeorm';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AccountEntity, AccountStatus } from './entities/org.entities';
import {
  AccountMemberEntity,
  AccountMemberRole,
  AccountMemberStatus,
} from './entities/AccountMember.entities';

import { BranchEntity } from './entities/AccountBranch.entities';
import { CreateAccountDto } from './dto/create-account.dto';
// import { AccountMongo } from '../schemas/account.schema';
import { GetAccountsDto } from './dto/getAll-account.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateAccountDto } from './dto/update.dto';

@Injectable()
export class AccountService {
  private isMongo = process.env.DATABASE_TYPE === 'mongo';

  constructor(
    @Optional()
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,

    @InjectRepository(AccountMemberEntity)
    private readonly accountMemberRepository: Repository<AccountMemberEntity>,

    @InjectRepository(BranchEntity)
    private readonly branchRepository: Repository<BranchEntity>,

    private readonly dataSource: DataSource,
  ) {}

  /** Entry point for controller */
  async executeByDBType(fn: string, ...args: any[]) {
    const methodMap: Record<string, Function> = this.isMongo
      ? {
          // create: this._createMongo.bind(this),
          // findAll: this._findAllMongo.bind(this),
          // findOne: this._findOneMongo.bind(this),
          // update: this._updateMongo.bind(this),
          // remove: this._removeMongo.bind(this),
        }
      : {
          create: this._createSql.bind(this),
          findAll: this._findAllSql.bind(this),
          findOne: this._findByIdSql.bind(this),
          update: this._updateSql.bind(this),
          remove: this._removeSql.bind(this),
        };

    const method = methodMap[fn];

    if (!method) {
      throw new Error(`Invalid function: ${fn}`);
    }

    return method(...args);
  }
  private async generateAccountCode(accountType: string): Promise<string> {
    let prefix = 'ACC';

    switch (accountType.toUpperCase()) {
      case 'STUDIO':
        prefix = 'STD';
        break;

      case 'FREELANCER':
        prefix = 'FRL';
        break;

      case 'PRINT_PARTNER':
        prefix = 'PRT';
        break;
    }

    const lastAccount = await this.accountRepository
      .createQueryBuilder('account')
      .where('account.account_code LIKE :prefix', {
        prefix: `${prefix}%`,
      })
      .orderBy('account.account_code', 'DESC')
      .getOne();

    let next = 1;

    if (lastAccount) {
      next = Number(lastAccount.accountCode.replace(prefix, '')) + 1;
    }

    return `${prefix}${next.toString().padStart(6, '0')}`;
  }

  // CREATE
  // async _createSql(dto: CreateAccountDto, req: any) {
  //   const account = new AccountEntity();

  //   account.accountCode = await this.generateAccountCode(dto.accountType);

  //   account.accountType = dto.accountType;
  //   account.accountName = dto.accountName;
  //   account.ownerUserId = dto.ownerUserId;

  //   account.legalName = dto.legalName;
  //   account.gstNumber = dto.gstNumber;
  //   account.email = dto.email;
  //   account.phone = dto.phone;
  //   account.website = dto.website;

  //   account.status = dto.status ?? AccountStatus.ACTIVE;

  //   account.onboardingFee = dto.onboardingFee ?? '0.00';
  //   account.commissionPercentage = dto.commissionPercentage ?? '10.00';

  //   account.createdBy = req.userId;

  //   return await this.accountRepository.save(account);
  // }

  async _createSql(dto: CreateAccountDto, req: any) {
    return await this.dataSource.transaction(async (manager) => {
      // Create Account
      const account = manager.create(AccountEntity, {
        accountCode: await this.generateAccountCode(dto.accountType),
        accountType: dto.accountType,
        accountName: dto.accountName,
        ownerUserId: dto.ownerUserId,
        legalName: dto.legalName,
        gstNumber: dto.gstNumber,
        email: dto.email,
        phone: dto.phone,
        website: dto.website,
        status: dto.status ?? AccountStatus.ACTIVE,
        onboardingFee: dto.onboardingFee ?? '0.00',
        commissionPercentage: dto.commissionPercentage ?? '10.00',
        createdBy: req.userId,
      });

      const savedAccount = await manager.save(AccountEntity, account);

      // Create Owner Member
      const member = manager.create(AccountMemberEntity, {
        accountId: savedAccount.id,
        userId: dto.ownerUserId,
        roleCode: dto.roleCode ?? 'OWNER',
        isPrimary: dto.isPrimary ?? true,
        joinedAt: new Date(),
        status: dto.status ?? AccountStatus.ACTIVE,
        createdBy: req.userId,
      });

      await manager.save(AccountMemberEntity, member);

      // Create Head Office Branch
      const branch = manager.create(BranchEntity, {
        accountId: savedAccount.id,
        branchCode: dto.branch.branchCode,
        branchName: dto.branch.branchName,
        city: dto.branch.city,
        state: dto.branch.state,
        country: dto.branch.country,
        address: dto.branch.address,
        phone: dto.branch.phone,
        email: dto.branch.email,
        isHeadOffice: dto.branch.isHeadOffice ?? true,
        status: dto.status ?? AccountStatus.ACTIVE,
        createdBy: req.userId,
      });

      await manager.save(BranchEntity, branch);

      return savedAccount;
    });
  }

  // GETALL
  // async _findAllSql(query: GetAccountsDto) {
  //   const {
  //     page = 1,
  //     limit = 10,
  //     search,
  //     status,
  //     accountType,
  //     sortBy,
  //     order,
  //   } = query;

  //   const qb = this.accountRepository
  //     .createQueryBuilder('account')
  //     .where('account.deletedAt IS NULL');

  //   if (search) {
  //     qb.andWhere(
  //       `(LOWER(account.accountName) LIKE LOWER(:search)
  //       OR LOWER(account.accountCode) LIKE LOWER(:search)
  //       OR LOWER(account.email) LIKE LOWER(:search)
  //       OR LOWER(account.phone) LIKE LOWER(:search))`,
  //       {
  //         search: `%${search}%`,
  //       },
  //     );
  //   }

  //   if (status !== undefined) {
  //     qb.andWhere('account.status = :status', { status });
  //   }

  //   if (accountType) {
  //     qb.andWhere('account.accountType = :accountType', {
  //       accountType,
  //     });
  //   }

  //   if (query.accountCode) {
  //     qb.andWhere('account.accountCode ILIKE :accountCode', {
  //       accountCode: `%${query.accountCode}%`,
  //     });
  //   }

  //   if (query.accountName) {
  //     qb.andWhere('account.accountName ILIKE :accountName', {
  //       accountName: `%${query.accountName}%`,
  //     });
  //   }

  //   if (query.ownerUserId) {
  //     qb.andWhere('account.ownerUserId = :ownerUserId', {
  //       ownerUserId: query.ownerUserId,
  //     });
  //   }

  //   qb.orderBy(`account.${sortBy}`, order);

  //   qb.skip((page - 1) * limit);
  //   qb.take(limit);

  //   const [data, total] = await qb.getManyAndCount();

  //   return {
  //     total,
  //     page,
  //     limit,
  //     totalPages: Math.ceil(total / limit),
  //     data,
  //   };
  // }

  async _findAllSql(query: GetAccountsDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      accountType,
      sortBy = 'createdAt',
      order = 'DESC',
    } = query;

    const qb = this.accountRepository
      .createQueryBuilder('account')

      // Members
      .leftJoinAndMapMany(
        'account.members',
        AccountMemberEntity,
        'member',
        `member.accountId = account.id`,
      )

      // Branches
      .leftJoinAndMapMany(
        'account.branches',
        BranchEntity,
        'branch',
        `branch.accountId = account.id`,
      )

      .where('account.deletedAt IS NULL');

    // ====================================================
    // Global Search
    // ====================================================

    if (search) {
      qb.andWhere(
        `(
        LOWER(account.accountName) LIKE LOWER(:search)
        OR LOWER(account.accountCode) LIKE LOWER(:search)
        OR LOWER(account.email) LIKE LOWER(:search)
        OR LOWER(account.phone) LIKE LOWER(:search)

        OR LOWER(member.roleCode) LIKE LOWER(:search)

        OR LOWER(branch.branchCode) LIKE LOWER(:search)
        OR LOWER(branch.branchName) LIKE LOWER(:search)
        OR LOWER(branch.city) LIKE LOWER(:search)
        OR LOWER(branch.state) LIKE LOWER(:search)
        OR LOWER(branch.country) LIKE LOWER(:search)
      )`,
        {
          search: `%${search}%`,
        },
      );
    }

    // ====================================================
    // Account Filters
    // ====================================================

    if (status !== undefined) {
      qb.andWhere('account.status = :status', { status });
    }

    if (accountType) {
      qb.andWhere('account.accountType = :accountType', {
        accountType,
      });
    }

    if (query.accountCode) {
      qb.andWhere('account.accountCode ILIKE :accountCode', {
        accountCode: `%${query.accountCode}%`,
      });
    }

    if (query.accountName) {
      qb.andWhere('account.accountName ILIKE :accountName', {
        accountName: `%${query.accountName}%`,
      });
    }

    if (query.ownerUserId) {
      qb.andWhere('account.ownerUserId = :ownerUserId', {
        ownerUserId: query.ownerUserId,
      });
    }

    // ====================================================
    // Member Filters
    // ====================================================

    if (query.roleCode) {
      qb.andWhere('member.roleCode = :roleCode', {
        roleCode: query.roleCode,
      });
    }

    if (query.userId) {
      qb.andWhere('member.userId = :userId', {
        userId: query.userId,
      });
    }

    if (query.isPrimary !== undefined) {
      qb.andWhere('member.isPrimary = :isPrimary', {
        isPrimary: query.isPrimary,
      });
    }

    // ====================================================
    // Branch Filters
    // ====================================================

    if (query.branchCode) {
      qb.andWhere('branch.branchCode ILIKE :branchCode', {
        branchCode: `%${query.branchCode}%`,
      });
    }

    if (query.branchName) {
      qb.andWhere('branch.branchName ILIKE :branchName', {
        branchName: `%${query.branchName}%`,
      });
    }

    if (query.city) {
      qb.andWhere('branch.city ILIKE :city', {
        city: `%${query.city}%`,
      });
    }

    if (query.state) {
      qb.andWhere('branch.state ILIKE :state', {
        state: `%${query.state}%`,
      });
    }

    if (query.country) {
      qb.andWhere('branch.country ILIKE :country', {
        country: `%${query.country}%`,
      });
    }

    if (query.isHeadOffice !== undefined) {
      qb.andWhere('branch.isHeadOffice = :isHeadOffice', {
        isHeadOffice: query.isHeadOffice,
      });
    }

    qb.orderBy(`account.${sortBy}`, order);

    qb.skip((page - 1) * limit);
    qb.take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }
  // GETBYID
  // async _findByIdSql(id: string) {
  //   const account = await this.accountRepository
  //     .createQueryBuilder('account')
  //     .where('account.id = :id', { id })
  //     .andWhere('account.deletedAt IS NULL')
  //     .getOne();

  //   if (!account) {
  //     throw new NotFoundException(`Account with id ${id} not found`);
  //   }

  //   return account;
  // }

  async _findByIdSql(id: string) {
    const account = await this.accountRepository
      .createQueryBuilder('account')

      // Members
      .leftJoinAndMapMany(
        'account.members',
        AccountMemberEntity,
        'member',
        `member.accountId = account.id`,
      )

      // Branches
      .leftJoinAndMapMany(
        'account.branches',
        BranchEntity,
        'branch',
        `branch.accountId = account.id`,
      )

      .where('account.id = :id', { id })
      .andWhere('account.deletedAt IS NULL')
      .getOne();

    if (!account) {
      throw new NotFoundException(`Account with id ${id} not found`);
    }

    return account;
  }
  // UPDATE
  // async _updateSql(id: string, dto: UpdateAccountDto, req: any) {
  //   const account = await this.accountRepository.findOne({
  //     where: {
  //       id,
  //     },
  //   });

  //   if (!account) {
  //     throw new NotFoundException('Account not found.');
  //   }

  //   Object.assign(account, dto);

  //   account.updatedBy = req.userId;
  //   account.updatedAt = new Date();

  //   console.log('Saves', account);
  //   console.log(dto);
  //   console.log(id);
  //   // return await this.accountRepository.save(account);
  //   const saved = await this.accountRepository.save(account);

  //   console.log('Saved Entity', saved);

  //   return saved;
  // }

  async _updateSql(id: string, dto: UpdateAccountDto, req: any) {
    return await this.dataSource.transaction(async (manager) => {
      const now = new Date();

      // =====================================================
      // Account
      // =====================================================

      const account = await manager.findOne(AccountEntity, {
        where: {
          id,
          deletedAt: IsNull(),
        },
      });

      if (!account) {
        throw new NotFoundException('Account not found.');
      }

      Object.assign(account, {
        accountType: dto.accountType ?? account.accountType,
        accountName: dto.accountName ?? account.accountName,
        ownerUserId: dto.ownerUserId ?? account.ownerUserId,
        legalName: dto.legalName ?? account.legalName,
        gstNumber: dto.gstNumber ?? account.gstNumber,
        email: dto.email ?? account.email,
        phone: dto.phone ?? account.phone,
        website: dto.website ?? account.website,
        status: dto.status ?? account.status,
        onboardingFee: dto.onboardingFee ?? account.onboardingFee,
        commissionPercentage:
          dto.commissionPercentage ?? account.commissionPercentage,
        updatedBy: req.userId,
        updatedAt: now,
      });

      const savedAccount = await manager.save(AccountEntity, account);

      // =====================================================
      // Primary Member
      // =====================================================

      const member = await manager.findOne(AccountMemberEntity, {
        where: {
          accountId: id,
          isPrimary: true,
        },
      });

      if (member) {
        if (dto.ownerUserId) {
          member.userId = dto.ownerUserId;
        }

        if (dto.roleCode) {
          member.roleCode = dto.roleCode;
        }

        if (dto.isPrimary !== undefined) {
          member.isPrimary = dto.isPrimary;
        }

        if (dto.status !== undefined) {
          member.status = dto.status;
        }

        member.updatedAt = now;
        member.updatedBy = req.userId;

        await manager.save(AccountMemberEntity, member);
      }

      // =====================================================
      // Head Office Branch
      // =====================================================

      if (dto.branch) {
        const branch = await manager.findOne(BranchEntity, {
          where: {
            accountId: id,
            isHeadOffice: true,
          },
        });

        if (branch) {
          Object.assign(branch, {
            branchCode: dto.branch.branchCode ?? branch.branchCode,
            branchName: dto.branch.branchName ?? branch.branchName,
            city: dto.branch.city ?? branch.city,
            state: dto.branch.state ?? branch.state,
            country: dto.branch.country ?? branch.country,
            address: dto.branch.address ?? branch.address,
            phone: dto.branch.phone ?? branch.phone,
            email: dto.branch.email ?? branch.email,
            isHeadOffice: dto.branch.isHeadOffice ?? branch.isHeadOffice,
            status: dto.status ?? branch.status,
            updatedAt: now,
            updatedBy: req.userId,
          });

          await manager.save(BranchEntity, branch);
        }
      }

      return savedAccount;
    });
  }
  // DELETE
  // async _removeSql(id: string, req: any) {
  //   const account = await this.accountRepository.findOne({
  //     where: {
  //       id,
  //       status: Not(AccountStatus.DELETED),
  //     },
  //   });

  //   if (!account) {
  //     throw new NotFoundException('Account not found.');
  //   }

  //   account.status = AccountStatus.DELETED;
  //   account.deletedAt = new Date();
  //   account.deletedBy = req.userId;

  //   await this.accountRepository.save(account);
  // }

  async _removeSql(id: string, req: any) {
    return await this.dataSource.transaction(async (manager) => {
      const account = await manager.findOne(AccountEntity, {
        where: {
          id,
          status: Not(AccountStatus.DELETED),
        },
      });

      if (!account) {
        throw new NotFoundException('Account not found.');
      }

      const now = new Date();

      // Soft Delete Account
      account.deletedAt = now;
      account.deletedBy = req.userId;
      account.updatedAt = now;
      account.updatedBy = req.userId;
      account.status = AccountStatus.DELETED; // Optional

      await manager.save(AccountEntity, account);

      // Soft Delete All Account Members
      await manager
        .createQueryBuilder()
        .update(AccountMemberEntity)
        .set({
          updatedAt: now,
          updatedBy: req.userId,
          status: AccountMemberStatus.DELETED,
        })
        .where('accountId = :accountId', {
          accountId: id,
        })
        .execute();

      return {
        message: 'Account deleted successfully.',
      };
    });
  }
}

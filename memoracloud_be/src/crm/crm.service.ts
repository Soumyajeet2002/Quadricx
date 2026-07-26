import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { isUUID } from 'class-validator';

import { CustomerEntity, CustomerStatus } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { GetCustomersDto } from './dto/get-customers.dto';

@Injectable()
export class CrmService {
  private readonly isMongo = process.env.DATABASE_TYPE === 'mongo';

  constructor(
    @Optional()
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  /** Entry point for controller dispatching by DB type */
  async executeByDBType(fn: string, ...args: any[]) {
    const methodMap: Record<string, Function> = this.isMongo
      ? {
          create: this._createMongo.bind(this),
          update: this._updateMongo.bind(this),
          findAll: this._findAllMongo.bind(this),
          findOne: this._findOneMongo.bind(this),
        }
      : {
          create: this._createSql.bind(this),
          update: this._updateSql.bind(this),
          findAll: this._findAllSql.bind(this),
          findOne: this._findOneSql.bind(this),
        };

    const method = methodMap[fn];
    if (!method) {
      throw new Error(`Invalid function: ${fn}`);
    }

    return method(...args);
  }

  /** Generate unique customer code CLI000001 format */
  private async generateCustomerCode(): Promise<string> {
    const prefix = 'CLI';
    const lastCustomer = await this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.customerCode LIKE :prefix', {
        prefix: `${prefix}%`,
      })
      .orderBy('customer.customerCode', 'DESC')
      .getOne();

    let next = 1;
    if (lastCustomer) {
      const lastCodeNum = Number(lastCustomer.customerCode.replace(prefix, ''));
      if (!isNaN(lastCodeNum)) {
        next = lastCodeNum + 1;
      }
    }

    return `${prefix}${next.toString().padStart(6, '0')}`;
  }

  // ==================== SQL (POSTGRES) METHODS ====================

  /** Create Customer in Postgres */
  async _createSql(dto: CreateCustomerDto, currentUser: any) {
    // 1. Unique email check
    if (dto.email) {
      const emailExists = await this.customerRepository.findOne({
        where: { email: dto.email, deletedAt: IsNull() },
      });
      if (emailExists) {
        throw new BadRequestException('Customer with this email already exists.');
      }
    }

    // 2. Unique phone check
    if (dto.phone) {
      const phoneExists = await this.customerRepository.findOne({
        where: { phone: dto.phone, deletedAt: IsNull() },
      });
      if (phoneExists) {
        throw new BadRequestException('Customer with this phone number already exists.');
      }
    }

    const customer = new CustomerEntity();
    customer.customerCode = await this.generateCustomerCode();
    customer.fullName = dto.fullName;
    customer.email = dto.email;
    customer.phone = dto.phone;
    customer.userId = dto.userId;
    customer.status = dto.status ?? CustomerStatus.ACTIVE;
    customer.createdBy = currentUser?.userId;

    return await this.customerRepository.save(customer);
  }

  /** Update Customer in Postgres */
  async _updateSql(id: string, dto: UpdateCustomerDto, currentUser: any) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid customer ID format.');
    }

    const customer = await this.customerRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }

    // 1. Unique email check
    if (dto.email && dto.email !== customer.email) {
      const emailExists = await this.customerRepository.findOne({
        where: { email: dto.email, deletedAt: IsNull() },
      });
      if (emailExists && emailExists.id !== id) {
        throw new BadRequestException('Customer with this email already exists.');
      }
    }

    // 2. Unique phone check
    if (dto.phone && dto.phone !== customer.phone) {
      const phoneExists = await this.customerRepository.findOne({
        where: { phone: dto.phone, deletedAt: IsNull() },
      });
      if (phoneExists && phoneExists.id !== id) {
        throw new BadRequestException('Customer with this phone number already exists.');
      }
    }

    if (dto.fullName !== undefined) customer.fullName = dto.fullName;
    if (dto.email !== undefined) customer.email = dto.email;
    if (dto.phone !== undefined) customer.phone = dto.phone;
    if (dto.userId !== undefined) customer.userId = dto.userId;
    if (dto.status !== undefined) customer.status = dto.status;
    customer.updatedBy = currentUser?.userId;

    return await this.customerRepository.save(customer);
  }

  /** Find One Customer by ID in Postgres */
  async _findOneSql(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid customer ID format.');
    }

    const customer = await this.customerRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }

    return customer;
  }

  /** Find All Customers in Postgres (with search, sort, pagination) */
  async _findAllSql(query: GetCustomersDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const { search, status, sortBy, order } = query;

    const qb = this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.deletedAt IS NULL');

    if (status !== undefined) {
      qb.andWhere('customer.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        `(LOWER(customer.fullName) LIKE LOWER(:search)
        OR LOWER(customer.customerCode) LIKE LOWER(:search)
        OR LOWER(customer.email) LIKE LOWER(:search)
        OR LOWER(customer.phone) LIKE LOWER(:search))`,
        {
          search: `%${search}%`,
        },
      );
    }

    qb.orderBy(`customer.${sortBy}`, order);

    qb.skip((page - 1) * limit);
    qb.take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ==================== MONGO STUBS ====================

  async _createMongo() {
    throw new Error('MongoDB implementation not enabled for Customer module.');
  }

  async _updateMongo() {
    throw new Error('MongoDB implementation not enabled for Customer module.');
  }

  async _findOneMongo() {
    throw new Error('MongoDB implementation not enabled for Customer module.');
  }

  async _findAllMongo() {
    throw new Error('MongoDB implementation not enabled for Customer module.');
  }
}

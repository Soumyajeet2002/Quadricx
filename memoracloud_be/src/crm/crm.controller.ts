import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/common/security/guards/jwt-auth.guard';
import { CrmService } from './crm.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { GetCustomersDto } from './dto/get-customers.dto';

@ApiTags('Customers')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CrmController {
  constructor(private readonly crmService: CrmService) { }

  @Post()
  async create(@Body() dto: CreateCustomerDto, @Req() req: any) {
    return this.crmService.executeByDBType('create', dto, req.user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
    @Req() req: any,
  ) {
    return this.crmService.executeByDBType('update', id, dto, req.user);
  }

  @Get()
  async findAll(@Query() query: GetCustomersDto) {
    console.log('query', query);
    return this.crmService.executeByDBType('findAll', query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.crmService.executeByDBType('findOne', id);
  }
}

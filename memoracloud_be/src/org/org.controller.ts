import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Query,
  ParseUUIDPipe,
  Param,
  Put,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/common/security/guards/jwt-auth.guard';

import { AccountService } from './org.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { GetAccountsDto } from './dto/getAll-account.dto';
import { UpdateAccountDto } from './dto/update.dto';

// @ApiBearerAuth('access-token')
// @UseGuards(JwtAuthGuard)
@Controller('accounts')
export class OrgController {
  constructor(private readonly orgService: AccountService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateAccountDto, @Req() req: any) {
    return this.orgService.executeByDBType('create', dto, req.user);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get()
  async get(@Query() query: GetAccountsDto) {
    return this.orgService.executeByDBType('findAll', query);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.orgService.executeByDBType('findOne', id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  // @Patch(':id')
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAccountDto,
    @Req() req: any,
  ) {
    return this.orgService.executeByDBType('update', id, dto, req.user);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.orgService.executeByDBType('remove', id, req.user);
  }
}

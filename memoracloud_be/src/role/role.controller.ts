import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/security/guards/jwt-auth.guard';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /** Create a new role */
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateRoleDto,@Req() req: any) {
    return this.roleService.executeByDBType('create', dto,req);
  }

  /** Get all roles with pagination & search */
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: QueryRoleDto) {
    return this.roleService.executeByDBType('findAll', query);
  }

  /** Get a single role by ID */
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.roleService.executeByDBType('findOne', id);
  }

  /** Update a role by ID */
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto,@Req() req: any) {
    return this.roleService.executeByDBType('update', id, dto,req);
  }

  /** Soft delete a role by ID (status=2) */
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string,@Req() req: any) {
    return this.roleService.executeByDBType('remove', id,req);
  }
}

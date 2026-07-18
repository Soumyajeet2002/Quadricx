import { Controller, Post, Get, Body, Param, Delete, Query, UseGuards, Put, Req } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/security/guards/jwt-auth.guard';

@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateMenuDto,@Req() req: any) {
    return this.menuService.executeByDBType('create', dto,req);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: QueryMenuDto) {
    return this.menuService.executeByDBType('findAll', query);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.executeByDBType('findOne', id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMenuDto,@Req() req: any) {
    return this.menuService.executeByDBType('update', id, dto,req);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string,@Req() req: any) {
    return this.menuService.executeByDBType('remove', id,req);
  }
}

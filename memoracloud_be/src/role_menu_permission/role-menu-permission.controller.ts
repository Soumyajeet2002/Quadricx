import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RoleMenuPermissionService } from './role-menu-permission.service';
import { CreateRoleMenuPermissionDto } from './dto/create-role-menu-permission.dto';
import { UpdateRoleMenuPermissionDto } from './dto/update-role-menu-permission.dto';

@ApiTags('Role Menu Permissions')
@Controller('role-menu-permissions')
export class RoleMenuPermissionController {
    constructor(private readonly service: RoleMenuPermissionService) { }

    @Post()
    create(@Req() req : Request,@Body() dto: CreateRoleMenuPermissionDto) {
        console.log('CreateRoleMenuPermissionDto received:', dto);
        return this.service.executeByDBType('create', dto,req);
    }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() dto: UpdateRoleMenuPermissionDto) {
    //     return this.service.executeByDBType('update', id, dto);
    // }

    @Get('role/:roleUnqId')
    getByRole(@Param('roleUnqId') roleUnqId: string) {
        return this.service.executeByDBType('getByRoleId', roleUnqId);
    }
}

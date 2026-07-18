import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/security/guards/jwt-auth.guard';
import { QueryUserDto } from './dto/query-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import type { Request } from 'express'
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/constants/common.constant';
import { RolesGuard } from 'src/common/security/guards/roles.guard';
import { GetUsersByRoleDto } from './dto/get-user-by-role.dto';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Get('getUserByMobile')
    async getUserByMobile(@Query('mobNumber') mobNumber: string) {
        return this.userService._findUserByMobNumber(mobNumber);
    }

    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Post()
    async createUser(@Req() req: Request, @Body() createUserDto: CreateUserDto) {
        return this.userService.executeByDBType('create', createUserDto, req);
    }

    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.SOCIETY_ADMIN)
    @Get()
    async getUsersList(@Query() query: QueryUserDto) {
        return this.userService.executeByDBType('findAll', query)
    }

    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    // @Roles(UserRole.SUPER_ADMIN, UserRole.SOCIETY_ADMIN)
    @Post('list')
    async getUsersByRoleCode(@Body() dto: GetUsersByRoleDto) {
        console.log("Controller hit", dto);
        return this.userService.executeByDBType('findByRoleCode', dto.roleCode);
    }

    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getUser(@Param('id') id: string) {
        return this.userService.executeByDBType('findOne', id)
    }

    /** Update a user by ID */
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateUserDetails(@Req() req: Request, @Param('id') id: string, @Body() data: UpdateUserDto) {
        return this.userService.executeByDBType('update', id, data, req)
    }

    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteUser(@Req() req: Request, @Param('id') id: string) {
        return this.userService.executeByDBType('remove', id, req)
    }



}

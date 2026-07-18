import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GetUsersByRoleDto {
    @ApiProperty({
        example: '13'
    })
    @IsNumber()
    roleCode: number;
}
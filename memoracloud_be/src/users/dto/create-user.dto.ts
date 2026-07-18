import { ApiProperty } from '@nestjs/swagger';
import {
    IsOptional,
    IsString,
    IsUUID,
    IsEmail,
    IsIn,
    IsNotEmpty,
    ValidateIf
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {

    @ApiProperty({
        example: 'George',
        required: false,
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        example: '6369544875',
        description: 'User mobile number (unique)',
    })
    @IsNotEmpty()
    @IsString()
    mobileNo: string;

    @ApiProperty({
        example: 'george@gmail.com',
        required: false,
    })
    @ValidateIf((o) => o.emailId?.trim() !== '')
    @IsEmail()
    emailId?: string;

    @ApiProperty({
        example: 'c1b7c0c1-9c2a-4a41-bb4e-3a0c0b1d1234',
        description: 'Role id',
        default: null,
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsUUID()
    roleId?: string;

    @ApiProperty({
        example: 1,
        default: 1,
        required: false,
    })
    @IsOptional()
    @IsIn([0, 1, 2])
    status?: number;

    @ApiProperty({
        example: 'hashed_refresh_token_value',
        required: false,
    })
    @IsOptional()
    @IsString()
    refreshToken?: string;

    @ApiProperty({
        example: 'Password@123',
        required: false,
    })
    @IsOptional()
    @IsString()
    password?: string;

    
}

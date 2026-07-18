import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({ example: 101 })
  @IsNumber()
  menuCode: number;

  @ApiProperty({ example: 'Dashboard' })
  @IsString()
  @IsNotEmpty()
  menuName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  menuDesc?: string;

  @ApiProperty({ example: 101 })
  @IsNumber()
  parentMenu?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  menuLevel?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  menuSeq?: number;

  @ApiProperty({ example: '/dashboard' })
  @IsOptional()
  menuUrl?: string;
  
  @ApiProperty({ example: 'icon' })
  @IsOptional()
  menuIcon?: string;

  @ApiProperty({ example: 0 , default: 0 })
  @IsOptional()
  menuType?: number;

  @ApiProperty({ enum: [0, 1, 2], default: 1 })
  @IsOptional()
  status?: number;
}

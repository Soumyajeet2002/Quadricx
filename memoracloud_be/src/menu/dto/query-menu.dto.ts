import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn, IsNumberString } from 'class-validator';

export class QueryMenuDto {
  @ApiPropertyOptional({ description: 'Search menu', example: 'Dashboard' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumberString()
  page?: number;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @ApiPropertyOptional({ default: 'created_at' })
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';


  @ApiPropertyOptional({
    description: '1 = return only parent menus (menuLevel = 1)',
    enum: [0, 1],
    default: 0,
  })
  @IsOptional()
  @IsIn(['0', '1'])
  onlyParent?: '0' | '1';
}

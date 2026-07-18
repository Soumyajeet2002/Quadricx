import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsString } from "class-validator";

export class QueryUserDto {
    @ApiPropertyOptional({
        description: 'Search user by name',
        example: "George"
    })
    @IsOptional()
    @IsString()
    search?: string

    @ApiPropertyOptional({
        description: "Page Number",
        example: 1,
        default: 1
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number

    @ApiPropertyOptional({
        description: "Limit per page",
        example: 10,
        default: 10
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number


    @ApiPropertyOptional({
        description: "sort by",
        example: 'created_at',
        default: 'created_at',
    })
    @IsOptional()
    @IsString()
    sortBy: string


    @ApiPropertyOptional({
        description: "sort order",
        example: 'DESC',
        enum: ['ASC', 'DESC'],
        default: 'DESC',
    })
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC';


}
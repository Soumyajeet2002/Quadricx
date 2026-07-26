import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString } from 'class-validator';

export class GetAccountByIdDto {
  @ApiProperty({
    description: 'Unique Account UUID.',
    example: 'afc8fe2c-92d2-4394-89d4-4548c42506c3',
  })
  @IsUUID()
  id!: string;
}

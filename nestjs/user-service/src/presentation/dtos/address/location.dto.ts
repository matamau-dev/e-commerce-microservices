import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, Length } from 'class-validator';

export class LocationDto {
	@ApiProperty({ example: 'Av. Central' })
	@IsString()
	street!: string;

	@ApiProperty({ example: '123' })
	@IsString()
	externalNumber!: string;

	@ApiPropertyOptional({ example: '4B' })
	@IsOptional()
	@IsString()
	internalNumber?: string;

	@ApiProperty({ example: 'Centro' })
	@IsString()
	neighborhood!: string;

	@ApiProperty({ example: 'Tuxtla Gutiérrez' })
	@IsString()
	city!: string;

	@ApiProperty({ example: 'Chiapas' })
	@IsString()
	state!: string;

	@ApiProperty({ example: '29000' })
	@IsString()
	@Length(5, 5)
	postalCode!: string;
}

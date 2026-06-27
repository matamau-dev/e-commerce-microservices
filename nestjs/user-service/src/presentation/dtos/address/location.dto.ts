import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class LocationDto {
	@ApiProperty({ example: 'Av. Central' })
	@Transform(({ value }) => value?.trim())
	@IsString()
	@Length(3, 100)
	street!: string;

	@ApiProperty({ example: '123' })
	@Transform(({ value }) => value?.trim())
	@Matches(/^[0-9]+[A-Za-z]?$/, {
		message: 'Número exterior inválido',
	})
	externalNumber!: string;

	@ApiPropertyOptional({ example: '4B' })
	@IsOptional()
	@Transform(({ value }) => value?.trim())
	@IsString()
	internalNumber?: string;

	@ApiProperty({ example: 'Centro' })
	@Transform(({ value }) => value?.trim())
	@IsString()
	@Length(3, 100)
	neighborhood!: string;

	@ApiProperty({ example: 'Tuxtla Gutiérrez' })
	@Transform(({ value }) => value?.trim())
	@IsString()
	@Length(2, 100)
	city!: string;

	@ApiProperty({ example: 'Chiapas' })
	@Transform(({ value }) => value?.trim())
	@IsString()
	@Length(2, 100)
	state!: string;

	@ApiProperty({ example: '29000' })
	@Matches(/^\d{5}$/, {
		message: 'El código postal debe tener exactamente 5 dígitos',
	})
	postalCode!: string;
}

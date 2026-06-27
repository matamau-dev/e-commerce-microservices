import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsString,
	IsBoolean,
	IsOptional,
	ValidateNested,
	Length,
	Matches,
	IsNotEmpty,
	MaxLength,
	IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from './location.dto';

export class CreateAddressDto {
	@ApiProperty({
		example: 'Juan Pérez',
		description: 'Nombre completo del destinatario',
	})
	@IsString()
	@Length(3, 100)
	fullName!: string;

	@ApiProperty({
		description: 'Número de teléfono mexicano de 10 dígitos',
		example: '9611234567',
	})
	@IsString()
	@IsNotEmpty()
	@Matches(/^\d{10}$/, {
		message: 'El teléfono debe tener exactamente 10 dígitos numéricos',
	})
	phone!: string;

	@ApiProperty({
		example: true,
		description: 'Indica si es la dirección por defecto',
	})
	@IsBoolean()
	isDefault!: boolean;

	@ApiProperty({
		type: () => LocationDto,
		description: 'Ubicación detallada de la dirección',
	})
	@IsDefined()
	@ValidateNested()
	@Type(() => LocationDto)
	location!: LocationDto;

	@ApiPropertyOptional({
		example: 'Casa azul con portón negro',
		description: 'Referencias adicionales',
	})
	@IsOptional()
	@IsString()
	@MaxLength(255)
	references?: string;
}

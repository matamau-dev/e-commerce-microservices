import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsString,
	IsBoolean,
	IsOptional,
	ValidateNested,
	IsPhoneNumber,
	Length,
	IsNotEmpty,
	Matches,
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
	@ValidateNested()
	@Type(() => LocationDto)
	location!: LocationDto;

	@ApiProperty({
		example: true,
		description: 'Indica si la dirección pertenece al usuario autenticado',
	})
	@IsBoolean()
	isMine!: boolean;

	@ApiPropertyOptional({
		example: 'Casa azul con portón negro',
		description: 'Referencias adicionales',
	})
	@IsOptional()
	@IsString()
	@Length(0, 255)
	references?: string;
}

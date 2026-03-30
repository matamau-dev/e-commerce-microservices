import {
	IsOptional,
	IsString,
	IsNotEmpty,
	MinLength,
	Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
	@ApiPropertyOptional({
		description: 'Nombre completo del usuario',
		example: 'Juan Pérez',
	})
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	name?: string;

	@ApiPropertyOptional({
		description: 'Nombre de usuario (mínimo 3 caracteres)',
		example: 'juanp',
	})
	@IsOptional()
	@IsString()
	@MinLength(3)
	userName?: string;

	@ApiPropertyOptional({
		description: 'Teléfono del usuario (10 dígitos)',
		example: '5512345678',
	})
	@IsOptional()
	@Matches(/^\d{10}$/, { message: 'El teléfono debe tener 10 dígitos' })
	phone?: string;
}

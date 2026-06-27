import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	Matches,
} from 'class-validator';

export class CreateCategoryDto {
	@ApiProperty({
		description:
			'Nombre visible de la categoría utilizado para clasificar productos, artículos o recursos.',
		example: 'Electrónica',
	})
	@IsString()
	@IsNotEmpty()
	@Transform(({ value }) => value?.trim())
	name!: string;

	@ApiPropertyOptional({
		description:
			'Identificador de la categoría padre. Permite construir estructuras jerárquicas de categorías y subcategorías.',
		example: 'a3d7c1f8-9f6d-4f4f-8e4c-2d6e5b8a1c22',
		nullable: true,
	})
	@IsUUID('4')
	@IsOptional()
	parentID?: string;

	@ApiPropertyOptional({
		description:
			'Versión amigable para URLs del nombre de la categoría. Se utiliza para SEO y rutas legibles.',
		example: 'electronica',
		nullable: true,
	})
	@Transform(({ value }) => value?.trim())
	@Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
		message:
			'El slug debe contener solo letras minúsculas, números y guiones.',
	})
	@IsString()
	@IsOptional()
	slug?: string;
}

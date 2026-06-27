import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateBrandDto {
	@ApiProperty({
		description:
			'Nombre visible de la categoría utilizado para clasificar productos, artículos o recursos.',
		example: 'Apple',
	})
	@IsString()
	@IsNotEmpty()
	@Transform(({ value }) => value?.trim())
	name!: string;

	@ApiPropertyOptional({
		description:
			'Versión amigable para URLs del nombre de la categoría. Se utiliza para SEO y rutas legibles.',
		example: 'apple',
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

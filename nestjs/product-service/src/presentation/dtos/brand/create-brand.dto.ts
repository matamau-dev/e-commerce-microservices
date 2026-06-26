import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateBrandDto {
	@ApiProperty({
		description:
			'Nombre visible de la categoría utilizado para clasificar productos, artículos o recursos.',
		example: 'Apple',
	})
	@IsString()
	name!: string;

	@ApiPropertyOptional({
		description:
			'Versión amigable para URLs del nombre de la categoría. Se utiliza para SEO y rutas legibles.',
		example: 'apple',
		nullable: true,
	})
	@IsString()
	@IsOptional()
	slug?: string;
}

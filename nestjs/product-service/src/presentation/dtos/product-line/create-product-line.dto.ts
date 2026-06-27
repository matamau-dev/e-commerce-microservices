import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateProductLineDto {
	@ApiProperty({
		description: 'Nombre de la línea de producto.',
		example: 'Galaxy S',
	})
	@Transform(({ value }) => value?.trim())
	@IsString()
	@IsNotEmpty()
	productLine!: string;

	@ApiPropertyOptional({
		description:
			'Slug de la línea de producto. Si no se envía, se generará automáticamente.',
		example: 'galaxy-s',
	})
	@Transform(({ value }) => value?.trim())
	@IsString()
	@IsOptional()
	@Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
		message:
			'El slug debe contener solo letras minúsculas, números y guiones.',
	})
	slug?: string;
}

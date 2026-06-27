import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateWishlistDto {
	@ApiPropertyOptional({
		description: 'Nombre de la wishlist',
		example: 'Mis productos favoritos',
	})
	@IsOptional()
	@Transform(({ value }) => value?.trim())
	@IsString()
	name?: string;

	@ApiPropertyOptional({
		description: 'Indica si la wishlist es privada',
		example: true,
		default: false,
	})
	@IsOptional()
	@Transform(({ value }) => value === 'true' || value === true)
	@IsBoolean()
	isPrivate?: boolean;
}

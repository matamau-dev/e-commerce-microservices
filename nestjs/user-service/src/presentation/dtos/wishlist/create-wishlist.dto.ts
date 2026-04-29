import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateWishlistDto {
	@ApiPropertyOptional({
		description: 'Nombre de la wishlist',
		example: 'Mis productos favoritos',
	})
	@IsOptional()
	@IsString()
	name?: string;

	@ApiPropertyOptional({
		description: 'Indica si la wishlist es privada',
		example: true,
		default: false,
	})
	@IsOptional()
	@IsBoolean()
	isPrivate?: boolean;
}

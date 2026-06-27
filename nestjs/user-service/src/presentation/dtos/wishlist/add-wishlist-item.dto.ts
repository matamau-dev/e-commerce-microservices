import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddWishlistItemDto {
	@ApiProperty({
		description: 'ID del producto que se agregará a la wishlist',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@IsUUID('4')
	productId!: string;
}

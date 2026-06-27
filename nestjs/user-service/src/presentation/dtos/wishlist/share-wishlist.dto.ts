import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShareWishlistDto {
	@ApiProperty({
		description: 'ID del usuario con quien se comparte la wishlist',
		example: 'c9d8e7f6-1a2b-4c3d-9e8f-112233445566',
	})
	@IsUUID('4')
	sharedWithUserId!: string;
}

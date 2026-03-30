import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
	@ApiProperty({
		description: 'Contraseña actual del usuario',
		example: 'Password123',
	})
	@IsString()
	currentPassword: string;

	@ApiProperty({
		description: 'Nueva contraseña (mínimo 8 caracteres)',
		example: 'NewPass123',
	})
	@IsString()
	@MinLength(8)
	newPassword: string;
}

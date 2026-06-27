import { IsString, MinLength, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
	@ApiProperty({
		description: 'Contraseña actual del usuario',
		example: 'Password123',
	})
	@IsString()
	@IsNotEmpty()
	currentPassword!: string;

	@ApiProperty({
		description:
			'Nueva contraseña (8-32 caracteres, con mayúscula, minúscula y número)',
		example: 'NewPass123',
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)
	newPassword!: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
	@ApiProperty({
		description: 'Token de restablecimiento',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsString()
	@IsNotEmpty()
	resetToken!: string;

	@ApiProperty({
		description: 'Nueva contraseña del usuario',
		example: 'NuevaContraseñaSegura123!',
	})
	@IsString()
	@MinLength(8)
	@Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)
	newPassword!: string;
}

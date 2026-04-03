import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
	@ApiProperty({
		description: 'Token de restablecimiento enviado por correo',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsString({ message: 'El token debe ser una cadena de texto' })
	@IsNotEmpty({ message: 'El token de restablecimiento es requerido' })
	resetToken: string;

	@ApiProperty({
		description: 'Nueva contraseña del usuario',
		example: 'NuevaContraseñaSegura123!',
	})
	@IsString({ message: 'La contraseña debe ser una cadena de texto' })
	@IsNotEmpty({ message: 'La nueva contraseña es requerida' })
	@MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
	newPassword: string;
}

// login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO para el login de usuarios.
 */
export class LoginDto {
	@ApiProperty({
		description: 'Correo electrónico del usuario',
		example: 'usuario@ejemplo.com',
	})
	@IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
	email: string;

	@ApiProperty({
		description: 'Contraseña del usuario',
		example: 'MiContraseña123!',
	})
	@IsString({ message: 'La contraseña debe ser una cadena de texto' })
	@IsNotEmpty({ message: 'La contraseña es requerida' })
	password: string;

	@ApiProperty({
		description:
			'Información del dispositivo desde donde se realiza el login',
		example: 'iPhone 14 Pro, iOS 16.4',
	})
	@IsString({ message: 'DeviceInfo debe ser una cadena de texto' })
	@IsNotEmpty({ message: 'DeviceInfo es requerido' })
	deviceInfo: string;

	@ApiProperty({
		description: 'Dirección IP del usuario',
		example: '192.168.1.1',
	})
	@IsString({ message: 'IP Address debe ser una cadena de texto' })
	@IsNotEmpty({ message: 'IP Address es requerido' })
	ipAddress: string;
}

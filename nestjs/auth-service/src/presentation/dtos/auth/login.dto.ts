import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
	@ApiProperty({
		description: 'Correo electrónico del usuario',
		example: 'usuario@ejemplo.com',
	})
	@IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
	email!: string;

	@ApiProperty({
		description: 'Contraseña del usuario',
		example: 'Password123',
	})
	@IsString()
	@IsNotEmpty()
	password!: string;
}

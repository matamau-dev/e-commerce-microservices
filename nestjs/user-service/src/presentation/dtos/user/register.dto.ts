import { ApiProperty } from '@nestjs/swagger';
import {
	IsString,
	IsEmail,
	IsNotEmpty,
	Length,
	Matches,
} from 'class-validator';
import { Exclude } from 'class-transformer';

export class RegisterDto {
	@ApiProperty({
		description: 'El nombre completo es obligatorio.',
		example: 'Juan Pérez',
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({
		description: 'El correo electrónico es obligatorio.',
		example: 'usuario@ejemplo.com',
	})
	@IsEmail()
	@IsNotEmpty()
	email!: string;

	@ApiProperty({
		description: 'Número de teléfono mexicano de 10 dígitos',
		example: '9611234567',
	})
	@IsNotEmpty()
	@Matches(/^\d{10}$/, {
		message: 'El teléfono debe tener exactamente 10 dígitos numéricos',
	})
	phone!: string;

	@ApiProperty({
		description:
			'Tu contraseña debe tener entre 8 y 32 caracteres e incluir al menos una mayúscula, una minúscula y un número.',
		example: 'Password123',
	})
	@IsString()
	@IsNotEmpty()
	@Length(8, 32)
	@Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, {
		message:
			'Tu contraseña debe tener entre 8 y 32 caracteres e incluir al menos una mayúscula, una minúscula y un número.',
	})
	@Exclude({ toPlainOnly: true })
	password!: string;
}

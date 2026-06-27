import { ApiProperty } from '@nestjs/swagger';
import {
	IsString,
	IsEmail,
	IsNotEmpty,
	Length,
	Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
	@ApiProperty({
		description: 'Nombre completo del usuario',
		example: 'Juan Pérez',
	})
	@Transform(({ value }) => value?.trim())
	@IsString()
	@Length(3, 100)
	name!: string;

	@ApiProperty({
		description: 'Correo electrónico',
		example: 'usuario@ejemplo.com',
	})
	@Transform(({ value }) => value?.toLowerCase()?.trim())
	@IsEmail()
	email!: string;

	@ApiProperty({
		description: 'Número de teléfono mexicano de 10 dígitos',
		example: '9611234567',
	})
	@IsString()
	@Matches(/^\d{10}$/, {
		message: 'El teléfono debe tener exactamente 10 dígitos numéricos',
	})
	phone!: string;

	@ApiProperty({
		description:
			'Debe tener 8–32 caracteres, con mayúscula, minúscula y número',
		example: 'Password123',
	})
	@IsString()
	@Length(8, 32)
	@Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)
	password!: string;
}

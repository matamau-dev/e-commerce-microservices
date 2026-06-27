import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class ForgotPasswordDto {
	@ApiProperty({
		description: 'Correo electrónico del usuario',
		example: 'usuario@ejemplo.com',
	})
	@Transform(({ value }) => value?.trim().toLowerCase())
	@IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
	email!: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
	@ApiProperty({
		description: 'Correo electrónico del usuario',
		example: 'usuario@ejemplo.com',
	})
	@IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
	@IsNotEmpty({ message: 'El correo electrónico es requerido' })
	email: string;
}

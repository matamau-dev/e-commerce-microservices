// refresh-token.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO para refrescar el token de un usuario.
 */
export class RefreshTokenDto {
	@ApiProperty({
		description: 'ID del usuario que solicita el refresh token',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsString({ message: 'userId debe ser una cadena de texto' })
	@IsNotEmpty({ message: 'userId es requerido' })
	userId: string;

	@ApiProperty({
		description: 'Refresh token actual del usuario',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
	})
	@IsString({ message: 'refreshToken debe ser una cadena de texto' })
	@IsNotEmpty({ message: 'refreshToken es requerido' })
	refreshToken: string;

	@ApiProperty({
		description:
			'Información del dispositivo desde donde se solicita el refresh',
		example: 'iPhone 14 Pro, iOS 16.4',
	})
	@IsString({ message: 'deviceInfo debe ser una cadena de texto' })
	@IsNotEmpty({ message: 'deviceInfo es requerido' })
	deviceInfo: string;

	@ApiProperty({
		description: 'Dirección IP desde donde se solicita el refresh token',
		example: '192.168.1.1',
	})
	@IsString({ message: 'ipAddress debe ser una cadena de texto' })
	@IsNotEmpty({ message: 'ipAddress es requerido' })
	ipAddress: string;
}

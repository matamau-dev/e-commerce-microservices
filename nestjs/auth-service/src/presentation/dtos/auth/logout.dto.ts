// logout.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

/**
 * DTO para cerrar sesión de un usuario.
 */
export class LogoutDto {
	@ApiProperty({
		description: 'ID del usuario que realiza el logout',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsString({ message: 'userId debe ser una cadena de texto' })
	@IsNotEmpty({ message: 'userId es requerido' })
	userId: string;

	@ApiProperty({
		description: 'Refresh token del usuario',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
	})
	@IsString({ message: 'refreshToken debe ser una cadena de texto' })
	@IsNotEmpty({ message: 'refreshToken es requerido' })
	refreshToken: string;

	@ApiProperty({
		description: 'Access token del usuario (para revocarlo también)',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
	})
	@IsString({ message: 'accessToken debe ser una cadena de texto' })
	@IsNotEmpty({ message: 'accessToken es requerido' })
	accessToken: string;

	@ApiPropertyOptional({
		description:
			'Indica si se debe cerrar sesión en todos los dispositivos',
		example: false,
	})
	@IsBoolean({ message: 'allDevices debe ser true o false' })
	@IsOptional()
	allDevices?: boolean;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class LogoutDto {
	@ApiPropertyOptional({
		description: 'Cerrar sesión en todos los dispositivos',
		example: false,
	})
	@IsOptional()
	@IsBoolean()
	allDevices?: boolean;
}

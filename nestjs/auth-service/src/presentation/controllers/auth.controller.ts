import { Body, Controller, Ip, Post, Headers, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBody,
	ApiHeader,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { LoginUseCase } from 'src/application/use-cases/login/login/login.use-case';
import { RefreshTokenUseCase } from 'src/application/use-cases/login/refresh-token/refresh-token.use-case';
import { LogoutUseCase } from 'src/application/use-cases/login/logout/logout.use-case';
import { LoginDto } from '../dtos/auth/login.dto';
import { RefreshTokenDto } from '../dtos/auth/refresh-token.dto';
import { Auth } from '../decorators/auth.decorator';
import { LogoutDto } from '../dtos/auth/logout.dto';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
	constructor(
		private readonly login: LoginUseCase,
		private readonly refreshToken: RefreshTokenUseCase,
		private readonly logout: LogoutUseCase,
	) {}

	@Post('login')
	@ApiOperation({ summary: 'Iniciar sesión' })
	@ApiBody({ type: LoginDto })
	@ApiHeader({
		name: 'user-agent',
		description: 'Información del dispositivo',
		required: false,
	})
	@ApiResponse({ status: 200, description: 'Login exitoso' })
	@ApiResponse({ status: 401, description: 'Credenciales inválidas' })
	logins(
		@Body() dto: LoginDto,
		@Ip() ip: string,
		@Headers('user-agent') userAgent: string,
	) {
		return this.login.execute({
			email: dto.email,
			password: dto.password,
			ipAddress: ip,
			deviceInfo: userAgent,
		});
	}

	@Post('refresh')
	@ApiOperation({ summary: 'Refrescar access token' })
	@ApiBody({ type: RefreshTokenDto })
	@ApiHeader({
		name: 'user-agent',
		description: 'Información del dispositivo',
		required: false,
	})
	@ApiResponse({ status: 200, description: 'Token renovado' })
	@ApiResponse({ status: 401, description: 'Refresh token inválido' })
	refresh(
		@Body() dto: RefreshTokenDto,
		@Headers('user-agent') userAgent: string,
		@Ip() ip: string,
	) {
		return this.refreshToken.execute({
			userId: dto.userId,
			refreshToken: dto.refreshToken,
			deviceInfo: userAgent,
			ipAddress: ip,
		});
	}

	@Post('logout')
	@Auth()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Cerrar sesión' })
	@ApiBody({ type: LogoutDto })
	@ApiHeader({
		name: 'authorization',
		description: 'Bearer token',
		required: true,
	})
	@ApiResponse({ status: 200, description: 'Logout exitoso' })
	@ApiResponse({ status: 401, description: 'No autorizado' })
	logouts(
		@CurrentUser('id') userId: string,
		@Body() dto: LogoutDto,
		@Headers('authorization') authHeader: string,
	) {
		const accessToken = authHeader?.replace('Bearer ', '');
		return this.logout.execute({
			userId,
			refreshToken: dto.refreshToken,
			accessToken,
			allDevices: dto.allDevices,
		});
	}
}

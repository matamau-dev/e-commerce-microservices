import { Body, Controller, Ip, Post, Headers, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LoginUseCase } from 'src/application/use-cases/login/login/login.use-case';
import { LogoutUseCase } from 'src/application/use-cases/login/logout/logout.use-case';
import { RefreshTokenUseCase } from 'src/application/use-cases/login/refresh-token/refresh-token.use-case';
import { LoginDto } from '../dtos/auth/login.dto';
import { Auth } from '../decorators/auth.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { LogoutDto } from '../dtos/auth/logout.dto';
import { RefreshTokenDto } from '../dtos/auth/refresh-token.dto';

@Controller('auth')
@UseGuards(ThrottlerGuard) // rate limiting en todo el controller
export class AuthController {
	constructor(
		private readonly login: LoginUseCase,
		private readonly refreshToken: RefreshTokenUseCase,
		private readonly logout: LogoutUseCase,
	) {}

	@Post('login')
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

	@Auth() // cualquier rol autenticado
	@Post('logout')
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

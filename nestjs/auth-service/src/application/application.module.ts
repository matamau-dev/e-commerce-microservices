import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

// Services
import { TotpService } from '../infrastructure/totp/totp.service';
import { UserServiceClient } from '../infrastructure/http/user-service.client';

// Use Cases
import { LoginUseCase } from './use-cases/login/login/login.use-case';
import { RefreshTokenUseCase } from './use-cases/login/refresh-token/refresh-token.use-case';
import { LogoutUseCase } from './use-cases/login/logout/logout.use-case';
import { EnableTotpUseCase } from './use-cases/two-factor/enable-totp/enable-totp.use-case';
import { VerifyTotpUseCase } from './use-cases/two-factor/verify-totp/verify-totp.use-case';
import { ForgotPasswordUseCase } from './use-cases/password/forgot-password/forgot-password.use-case';
import { ResetPasswordUseCase } from './use-cases/password/reset-password/reset-password.use-case';

const useCases = [
	{
		provide: LoginUseCase,
		useFactory: (
			userServiceClient,
			sessionWriter,
			loginAttemptReader,
			loginAttemptWriter,
			twoFactorReader,
			tokenService,
			hashService,
		) =>
			new LoginUseCase(
				userServiceClient,
				sessionWriter,
				loginAttemptReader,
				loginAttemptWriter,
				twoFactorReader,
				tokenService,
				hashService,
			),
		inject: [
			UserServiceClient,
			'SessionWriter',
			'LoginAttemptReader',
			'LoginAttemptWriter',
			'TwoFactorReader',
			'TokenService',
			'HashService',
		],
	},
	{
		provide: RefreshTokenUseCase,
		useFactory: (sessionReader, sessionWriter, tokenService, hashService) =>
			new RefreshTokenUseCase(
				sessionReader,
				sessionWriter,
				tokenService,
				hashService,
			),
		inject: ['SessionReader', 'SessionWriter', 'TokenService', 'HashService'],
	},
	{
		provide: LogoutUseCase,
		useFactory: (
			sessionReader,
			sessionWriter,
			revokedTokenWriter,
			hashService,
		) =>
			new LogoutUseCase(
				sessionReader,
				sessionWriter,
				revokedTokenWriter,
				hashService,
			),
		inject: [
			'SessionReader',
			'SessionWriter',
			'RevokedTokenWriter',
			'HashService',
		],
	},
	{
		provide: EnableTotpUseCase,
		useFactory: (twoFactorReader, twoFactorWriter, totpService) =>
			new EnableTotpUseCase(twoFactorReader, twoFactorWriter, totpService),
		inject: ['TwoFactorReader', 'TwoFactorWriter', TotpService],
	},
	{
		provide: VerifyTotpUseCase,
		useFactory: (
			twoFactorReader,
			twoFactorWriter,
			sessionWriter,
			tokenService,
			hashService,
			totpService,
		) =>
			new VerifyTotpUseCase(
				twoFactorReader,
				twoFactorWriter,
				sessionWriter,
				tokenService,
				hashService,
				totpService,
			),
		inject: [
			'TwoFactorReader',
			'TwoFactorWriter',
			'SessionWriter',
			'TokenService',
			'HashService',
			TotpService,
		],
	},
	{
		provide: ForgotPasswordUseCase,
		useFactory: (userServiceClient, publisher) =>
			new ForgotPasswordUseCase(userServiceClient, publisher),
		inject: [UserServiceClient, 'PasswordResetRequestedPublisher'],
	},
	{
		provide: ResetPasswordUseCase,
		useFactory: (userServiceClient, sessionWriter, hashService) =>
			new ResetPasswordUseCase(userServiceClient, sessionWriter, hashService),
		inject: [UserServiceClient, 'SessionWriter', 'HashService'],
	},
];

@Module({
	imports: [InfrastructureModule],
	providers: [...useCases],
	exports: [...useCases],
})
export class ApplicationModule {}

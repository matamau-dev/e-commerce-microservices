import * as crypto from 'crypto';
import {
	LoginAttemptReader,
	LoginAttemptWriter,
} from 'src/domain/repositories/login-attempt.repository';
import { SessionWriter } from 'src/domain/repositories/session.repository';
import { TwoFactorReader } from 'src/domain/repositories/two-factor.repository';
import { HashService } from 'src/domain/service/hash.service';
import { TokenService } from 'src/domain/service/token.service';
import { UserServiceClient } from 'src/infrastructure/http/user-service.client';
import { LoginInput } from './login.input';
import { LoginOutput } from './login.output';
import { TooManyAttemptsException } from 'src/domain/exceptions/too-many-attempts.exception';
import { InvalidCredentialsException } from 'src/domain/exceptions/invalid-credentials.exception';
import { AccountInactiveException } from 'src/domain/exceptions/account-inactive.exception';
import { RoleEnum } from 'src/domain/enums/role.enum';
import { Email } from 'src/domain/value-objects/email_or_user_name.value-object';

export class LoginUseCase {
	constructor(
		private readonly userServiceClient: UserServiceClient,
		private readonly sessionWriter: SessionWriter,
		private readonly loginAttemptReader: LoginAttemptReader,
		private readonly loginAttemptWriter: LoginAttemptWriter,
		private readonly twoFactorReader: TwoFactorReader,
		private readonly tokenService: TokenService,
		private readonly hashService: HashService,
	) {}

	async execute(input: LoginInput): Promise<LoginOutput> {
		const email = new Email(input.email);
		const recentFailures =
			await this.loginAttemptReader.countRecentFailedByEmail(
				input.email,
				15,
			);

		if (recentFailures >= 5) throw new TooManyAttemptsException();

		const user = await this.userServiceClient.findByEmail(input.email);

		if (!user) {
			await this.loginAttemptWriter.create({
				id: crypto.randomUUID(),
				email: email,
				success: false,
				ipAddress: input.ipAddress,
				deviceInfo: input.deviceInfo,
				createdAt: new Date(),
			});
			throw new InvalidCredentialsException();
		}

		if (!user.isActive) throw new AccountInactiveException();

		const validPassword = await this.hashService.compare(
			input.password,
			user.password,
		);

		if (!validPassword) {
			await this.loginAttemptWriter.create({
				id: crypto.randomUUID(),
				userId: user.id,
				email: email,
				success: false,
				ipAddress: input.ipAddress,
				deviceInfo: input.deviceInfo,
				createdAt: new Date(),
			});
			throw new InvalidCredentialsException();
		}

		await this.loginAttemptWriter.create({
			id: crypto.randomUUID(),
			userId: user.id,
			email: email,
			success: true,
			ipAddress: input.ipAddress,
			deviceInfo: input.deviceInfo,
			createdAt: new Date(),
		});

		const twoFactor = await this.twoFactorReader.findByUserId(user.id);
		if (twoFactor?.isEnabled) {
			// No genera tokens aún — espera la verificación 2FA
			return {
				accessToken: '',
				refreshToken: '',
				requiresTwoFactor: true,
				user: { id: user.id, role: user.role as RoleEnum },
			};
		}

		const accessToken = this.tokenService.generateAccessToken({
			userId: user.id,
			role: user.role as RoleEnum,
		});
		const refreshToken = this.tokenService.generateRefreshToken();

		await this.sessionWriter.create({
			id: crypto.randomUUID(),
			userId: user.id,
			role: user.role as RoleEnum,
			refreshToken: await this.hashService.hash(refreshToken),
			deviceInfo: input.deviceInfo,
			ipAddress: input.ipAddress,
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
			createdAt: new Date(),
		});

		return {
			accessToken,
			refreshToken,
			requiresTwoFactor: false,
			user: { id: user.id, role: user.role as RoleEnum },
		};
	}
}

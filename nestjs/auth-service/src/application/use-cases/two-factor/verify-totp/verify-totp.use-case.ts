import { SessionWriter } from 'src/domain/repositories/session.repository';
import {
	TwoFactorReader,
	TwoFactorWriter,
} from 'src/domain/repositories/two-factor.repository';
import { HashService } from 'src/domain/service/hash.service';
import { TokenService } from 'src/domain/service/token.service';
import { VerifyTotpInput } from './verify-totp.input';
import { VerifyTotpOutput } from './verify-totp.output';
import { InvalidTotpException } from 'src/domain/exceptions/invalid-totp.exception';
import { TotpService } from 'src/infrastructure/totp/totp.service';

export class VerifyTotpUseCase {
	constructor(
		private readonly twoFactorReader: TwoFactorReader,
		private readonly twoFactorWriter: TwoFactorWriter,
		private readonly sessionWriter: SessionWriter,
		private readonly tokenService: TokenService,
		private readonly hashService: HashService,
		private readonly totpService: TotpService,
	) {}

	async execute(input: VerifyTotpInput): Promise<VerifyTotpOutput> {
		const twoFactor = await this.twoFactorReader.findByUserId(input.userId);
		if (!twoFactor) throw new InvalidTotpException();

		const valid = this.totpService.verify(input.code, twoFactor.secret);
		if (!valid) throw new InvalidTotpException();

		if (!twoFactor.isEnabled) {
			// Primera verificación — activa el 2FA
			twoFactor.isEnabled = true;
			twoFactor.verifiedAt = new Date();
			await this.twoFactorWriter.update(twoFactor);
		}

		// Si viene del login, genera los tokens ahora
		if (input.isLoginVerification && input.role) {
			const accessToken = this.tokenService.generateAccessToken({
				userId: input.userId,
				role: input.role,
			});
			const refreshToken = this.tokenService.generateRefreshToken();

			await this.sessionWriter.create({
				id: crypto.randomUUID(),
				userId: input.userId,
				role: input.role,
				refreshToken: await this.hashService.hash(refreshToken),
				deviceInfo: 'verified-2fa',
				ipAddress: '',
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
				createdAt: new Date(),
			});

			return { verified: true, accessToken, refreshToken };
		}

		return { verified: true };
	}
}

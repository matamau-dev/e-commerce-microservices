import * as crypto from 'crypto';
import {
	TwoFactorReader,
	TwoFactorWriter,
} from 'src/domain/repositories/two-factor.repository';
import { EnableTotpInput } from './enable-totp.input';
import { EnableTotpOutput } from './enable-totp.output';
import { TotpService } from 'src/infrastructure/totp/totp.service';

export class EnableTotpUseCase {
	constructor(
		private readonly twoFactorReader: TwoFactorReader,
		private readonly twoFactorWriter: TwoFactorWriter,
		private readonly totpService: TotpService,
	) {}

	async execute(input: EnableTotpInput): Promise<EnableTotpOutput> {
		const existing = await this.twoFactorReader.findByUserId(input.userId);

		// Genera un nuevo secreto TOTP
		const { secret, qrCodeUrl } = this.totpService.generateSecret(
			input.userId,
		);

		if (existing) {
			// Actualiza el secreto existente — no está habilitado aún hasta verificar
			existing.secret = secret;
			existing.isEnabled = false;
			existing.verifiedAt = undefined;
			await this.twoFactorWriter.update(existing);
		} else {
			await this.twoFactorWriter.save({
				id: crypto.randomUUID(),
				userId: input.userId,
				secret,
				isEnabled: false,
				createdAt: new Date(),
			});
		}

		return { secret, qrCodeUrl };
	}
}

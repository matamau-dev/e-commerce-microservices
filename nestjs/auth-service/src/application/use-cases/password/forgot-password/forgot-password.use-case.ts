import * as crypto from 'crypto';
import { UserServiceClient } from 'src/infrastructure/http/user-service.client';
import { PasswordResetRequestedPublisher } from 'src/domain/events/password-reset-requested.publisher';
import { ForgotPasswordInput } from './forgot-password.input';
import { ForgotPasswordOutput } from './forgot-password.output';

export class ForgotPasswordUseCase {
	constructor(
		private readonly userServiceClient: UserServiceClient,
		private readonly publisher: PasswordResetRequestedPublisher,
	) {}

	async execute(input: ForgotPasswordInput): Promise<ForgotPasswordOutput> {
		const user = await this.userServiceClient.findByEmail(input.email);

		// Siempre responde lo mismo — no revela si el email existe o no
		if (!user) {
			return { message: 'Si el correo existe recibirás instrucciones' };
		}

		// Genera token de reset — UUID simple, expira en 30 minutos
		const resetToken = crypto.randomUUID();
		const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

		// Publica evento — Notification MS manda el correo
		// User MS guarda el reset token hasheado
		await this.publisher.publish({
			userId: user.id,
			email: input.email,
			resetToken,
			expiresAt,
		});

		return { message: 'Si el correo existe recibirás instrucciones' };
	}
}

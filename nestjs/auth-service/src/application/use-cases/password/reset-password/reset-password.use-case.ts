import { SessionWriter } from 'src/domain/repositories/session.repository';
import { HashService } from 'src/domain/service/hash.service';
import { ResetPasswordInput } from './reset-password.input';
import { ResetPasswordOutput } from './reset-password.output';
import { InvalidResetTokenException } from 'src/domain/exceptions/invalid-reset-token.exception';
import { UserServiceClient } from 'src/infrastructure/http/user-service.client';

export class ResetPasswordUseCase {
	constructor(
		private readonly userServiceClient: UserServiceClient,
		private readonly sessionWriter: SessionWriter,
		private readonly hashService: HashService,
	) {}

	async execute(input: ResetPasswordInput): Promise<ResetPasswordOutput> {
		// User MS verifica el token y actualiza el password
		const result = await this.userServiceClient.resetPassword({
			resetToken: input.resetToken,
			newPassword: input.newPassword,
		});

		if (!result.success) throw new InvalidResetTokenException();

		// Cierra todas las sesiones activas — seguridad
		await this.sessionWriter.deleteAllByUserId(result.userId);

		return { message: 'Contraseña actualizada correctamente' };
	}
}

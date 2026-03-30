import {
	UserReader,
	UserWriter,
} from 'src/domain/repositories/user.repository';
import { HashService } from 'src/domain/services/hash.service';
import { DeleteAccountInput } from './delete-account.input';
import { DeleteAccountOutput } from './delete-account.output';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';
import { InvalidPasswordException } from 'src/domain/exceptions/user/invalid-password.exception';

// delete-account/delete-account.use-case.ts
export class DeleteAccountUseCase {
	constructor(
		private readonly userReader: UserReader,
		private readonly userWriter: UserWriter,
		private readonly hashService: HashService,
		// private readonly publisher: AccountDeletedPublisher,
	) {}

	async execute(input: DeleteAccountInput): Promise<DeleteAccountOutput> {
		const user = await this.userReader.findById(input.userId);
		if (!user) throw new UserNotFoundException(input.userId);

		// Confirma password antes de eliminar
		const validPassword = await this.hashService.compare(
			input.password,
			user.password,
		);
		if (!validPassword) throw new InvalidPasswordException();

		// Soft delete — solo marca deletedAt, no borra de la DB
		const deletedAt = new Date();
		await this.userWriter.softDelete(input.userId);

		// Notifica a otros MS — Auth MS revoca tokens, Orders MS cancela pedidos
		// await this.publisher.publish({ userId: user.id, deletedAt });

		return {
			message: 'Cuenta eliminada correctamente',
			deletedAt,
		};
	}
}

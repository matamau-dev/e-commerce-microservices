import {
	UserReader,
	UserWriter,
} from 'src/domain/repositories/user.repository';
import { PermanentDeleteInput } from './permanent-delete.input';
import { PermanentDeleteOutput } from './permanent-delete.output';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';

// permanent-delete/permanent-delete.use-case.ts
export class PermanentDeleteUseCase {
	constructor(
		private readonly userReader: UserReader,
		private readonly userWriter: UserWriter,
	) {}

	async execute(input: PermanentDeleteInput): Promise<PermanentDeleteOutput> {
		const user = await this.userReader.findById(input.targetUserId);
		if (!user) throw new UserNotFoundException(input.targetUserId);

		// Regla de negocio — solo se puede eliminar permanentemente
		// una cuenta que ya fue soft deleted
		// if (!user.deletedAt) throw new AccountNotDeletedException();

		// Elimina físicamente de la DB
		await this.userWriter.permanentDelete(input.targetUserId);

		return { message: 'Usuario eliminado permanentemente' };
	}
}

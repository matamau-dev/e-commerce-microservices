import {
	UserReader,
	UserWriter,
} from 'src/domain/repositories/user.repository';
import { HashService } from 'src/domain/services/hash.service';
import { UpdatePasswordInput } from './update-password.input';
import { UpdatePasswordOutput } from './update-password.output';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';
import { InvalidPasswordException } from 'src/domain/exceptions/user/invalid-password.exception';
import { SamePasswordException } from 'src/domain/exceptions/user/same-password.exception';

export class UpdatePasswordUseCase {
	constructor(
		private readonly userReader: UserReader,
		private readonly userWriter: UserWriter,
		private readonly hashService: HashService,
	) {}

	async execute(input: UpdatePasswordInput): Promise<UpdatePasswordOutput> {
		const user = await this.userReader.findById(input.userId);
		if (!user) throw new UserNotFoundException(input.userId);

		// Verifica que la contraseña actual sea correcta
		const validPassword = await this.hashService.compare(
			input.currentPassword,
			user.password,
		);
		if (!validPassword) throw new InvalidPasswordException();

		// Regla de negocio — no puede ser igual a la actual
		const samePassword = await this.hashService.compare(
			input.newPassword,
			user.password,
		);
		if (samePassword) throw new SamePasswordException();

		user.password = await this.hashService.hash(input.newPassword);

		await this.userWriter.update(user);

		return { message: 'Contraseña actualizada correctamente' };
	}
}

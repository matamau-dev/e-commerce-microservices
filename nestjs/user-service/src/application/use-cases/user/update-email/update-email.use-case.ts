import {
	UserReader,
	UserWriter,
} from 'src/domain/repositories/user.repository';
import { HashService } from 'src/domain/services/hash.service';
import { UpdateEmailOutput } from './update-email.output';
import { UpdateEmailInput } from './update-email.input';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';
import { Email } from 'src/domain/value-objects/email.value-object';
import { UserVerification } from '../../../../domain/repositories/user.repository';
import { EmailAlreadyExistsException } from 'src/domain/exceptions/user/email-already-exists.exception';
import { InvalidPasswordException } from 'src/domain/exceptions/user/invalid-password.exception';

export class UpdateEmailUseCase {
	constructor(
		private readonly userReader: UserReader,
		private readonly userWriter: UserWriter,
		private readonly userVerification: UserVerification,
		private readonly hashService: HashService,
		// private readonly publisher: EmailChangeRequestedPublisher,
	) {}

	async execute(input: UpdateEmailInput): Promise<UpdateEmailOutput> {
		const user = await this.userReader.findById(input.userId);
		if (!user) throw new UserNotFoundException(input.userId);

		const validPassword = await this.hashService.compare(
			input.password,
			user.password,
		);
		if (!validPassword) throw new InvalidPasswordException();

		// Valida el nuevo email con el value object
		const newEmail = new Email(input.newEmail);

		// Verifica que no esté en uso
		const exists = await this.userVerification.existByEmail(
			newEmail.getValue(),
		);
		if (exists) throw new EmailAlreadyExistsException(input.newEmail);

		// No cambia el email todavía — publica evento para que
		// Notification MS mande el correo de verificación
		// await this.publisher.publish({
		// 	userId: user.id,
		// 	newEmail: newEmail.getValue(),
		// });

		return { message: 'Te enviamos un correo de verificación' };
	}
}

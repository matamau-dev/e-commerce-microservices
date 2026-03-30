import {
	UserVerification,
	UserWriter,
} from 'src/domain/repositories/user.repository';
import { RegisterClientInput } from './register-client.input';
import { RegisterClientOutput } from './register-client.output';
import { User } from 'src/domain/entities/user/user.entity';
import { HashService } from 'src/domain/services/hash.service';
import { Email } from 'src/domain/value-objects/email.value-object';
import { Phone } from 'src/domain/value-objects/phone.value-object';
import { UserName } from 'src/domain/value-objects/user-name.value-object';
import { EmailAlreadyExistsException } from 'src/domain/exceptions/user/email-already-exists.exception';
export class RegisterClientUseCase {
	constructor(
		private readonly userWriter: UserWriter,
		private readonly userVerification: UserVerification,
		private readonly hashService: HashService,
	) {}

	async execute(input: RegisterClientInput): Promise<RegisterClientOutput> {
		console.log(`Esto llega ${input}`);
		const email = new Email(input.email);
		const phone = new Phone(input.phone);
		const userName = new UserName(input.userName);
		console.log('Pasa las verificaciones.', email.getValue());
		const exists = await this.userVerification.existByEmail(
			email.getValue(),
		);
		if (exists) throw new EmailAlreadyExistsException(email.getValue());

		const hashedPassword = await this.hashService.hash(input.password);

		const user = new User();
		user.id = crypto.randomUUID();
		user.name = input.name.trim();
		user.userName = userName;
		user.email = email;
		user.phone = phone;
		user.password = hashedPassword;
		user.isActive = false;
		user.createdAt = new Date();

		await this.userWriter.create(user);

		return {
			id: user.id,
			name: user.name,
			userName: user.userName.getValue(),
			email: user.email.getValue(),
			phone: user.phone.getValue(),
			createdAt: user.createdAt,
		};
	}
}

import {
	UserVerification,
	UserWriter,
} from 'src/domain/repositories/user/user.repository';
import { RegisterClientInput } from './register-client.input';
import { RegisterClientOutput } from './register-client.output';
import { User } from 'src/domain/entities/user/user.entity';
import { HashService } from 'src/domain/services/hash.service';
import { PhoneNumber } from 'src/domain/value-objects/utils/phone.value-object';
import { EmailAlreadyExistsException } from 'src/domain/exceptions/user/email-already-exists.exception';
import { PhoneAlreadyExistsException } from 'src/domain/exceptions/user/phone-already-exists.exception';
import { Email } from 'src/domain/value-objects/user/email.value-object';
export class RegisterClientUseCase {
	constructor(
		private readonly userWriter: UserWriter,
		private readonly userVerification: UserVerification,
		private readonly hashService: HashService,
	) {}

	async execute(input: RegisterClientInput): Promise<RegisterClientOutput> {
		const email = new Email(input.email);
		const phone = new PhoneNumber(input.phone);
		const existsEmail = await this.userVerification.existByEmail(
			email.getValue(),
		);
		const existPhone = await this.userVerification.existByPhone(
			phone.getValue(),
		);
		if (existsEmail)
			throw new EmailAlreadyExistsException(email.getValue());
		if (existPhone) throw new PhoneAlreadyExistsException(phone.getValue());

		const hashedPassword = await this.hashService.hash(input.password);

		const user = new User();
		user.id = crypto.randomUUID();
		user.name = input.name.trim();
		user.email = email;
		user.phone = phone;
		user.password = hashedPassword;
		user.isActive = false;
		user.createdAt = new Date();

		await this.userWriter.create(user);

		return {
			id: user.id,
			name: user.name,
			email: user.email.getValue(),
			phone: user.phone.getValue(),
			createdAt: user.createdAt,
		};
	}
}

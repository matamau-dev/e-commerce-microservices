import { RoleEnum } from 'src/domain/enums/role.enum';
import { UserReader } from 'src/domain/repositories/user.repository';
import { FindEmailInput } from './find-email.input';
import { FindEmailOutput } from './find-email.output';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';

export class FindEmailUseCase {
	constructor(private readonly userReader: UserReader) {}

	async execute(findEmailInput: FindEmailInput): Promise<FindEmailOutput> {
		const user = await this.userReader.findByEmail(findEmailInput.email);

		if (!user) throw new UserNotFoundException(findEmailInput.email);

		return {
			id: user.id,
			email: user.email.getValue(),
			password: user.password,
			role: user.role,
			isActive: user.isActive,
		};
	}
}

import { UserReader } from 'src/domain/repositories/user.repository';
import { GetProfileOutput } from './get-profile.output';
import { GetProfileInput } from './get-profile.input';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';

export class GetProfileUseCase {
	constructor(private readonly userReader: UserReader) {}

	async execute(getProfileInput: GetProfileInput): Promise<GetProfileOutput> {
		const user = await this.userReader.findById(getProfileInput.userId);
		if (!user) throw new UserNotFoundException(getProfileInput.userId);

		return {
			id: user.id,
			name: user.name,
			userName: user.userName.getValue(),
			email: user.email.getValue(),
			phone: user.phone.getValue(),
			isActive: user.isActive,
			createdAt: user.createdAt,
		};
	}
}

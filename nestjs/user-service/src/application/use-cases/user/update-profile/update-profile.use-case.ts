import {
	UserReader,
	UserWriter,
} from 'src/domain/repositories/user/user.repository';
import { UpdateProfileInput } from './update-profile.input';
import { UpdateProfileOutput } from './update-profile.output';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';
import { PhoneNumber } from 'src/domain/value-objects/utils/phone.value-object';

export class UpdateProfileUsecase {
	constructor(
		private readonly userReader: UserReader,
		private readonly userWriter: UserWriter,
	) {}

	async execute(input: UpdateProfileInput): Promise<UpdateProfileOutput> {
		const user = await this.userReader.findById(input.userId);
		if (!user) throw new UserNotFoundException(input.userId);

		if (input.name) user.name = input.name.trim();
		if (input.phone) user.phone = new PhoneNumber(input.phone);

		const updated = await this.userWriter.update(user);

		return {
			id: updated.id,
			name: updated.name,
			email: updated.email.getValue(),
			phone: updated.phone.getValue(),
		};
	}
}

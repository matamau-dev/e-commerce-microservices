import { UserReader } from 'src/domain/repositories/user/user.repository';
import { GetProfileOutput } from './get-profile.output';
import { GetProfileInput } from './get-profile.input';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';
import { LocalStorageService } from 'src/infrastructure/storage/local-storage.service';

export class GetProfileUseCase {
	constructor(
		private readonly userReader: UserReader,
		private readonly localStorageService: LocalStorageService,
	) {}

	async execute(getProfileInput: GetProfileInput): Promise<GetProfileOutput> {
		const user = await this.userReader.findById(getProfileInput.userId);
		if (!user) throw new UserNotFoundException(getProfileInput.userId);

		const profileImage = user.profileImages
			? {
					url: this.localStorageService.getPublicUrl(
						user.profileImages.url,
						'profile-images',
					),
					type: user.profileImages.typeFile,
				}
			: null;

		return {
			id: user.id,
			name: user.name,
			email: user.email.getValue(),
			phone: user.phone.getValue(),
			isActive: user.isActive,
			createdAt: user.createdAt,
			profileImage,
		};
	}
}

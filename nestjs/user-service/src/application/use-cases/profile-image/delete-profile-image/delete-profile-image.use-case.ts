import { ProfileImageReader } from 'src/domain/repositories/image_user/profile-image.repository';
import { LocalStorageService } from 'src/infrastructure/storage/local-storage.service';
import { DeleteProfileImageInput } from './delete-profile-image.input';
import { DeleteProfileImageOutput } from './delete-profile-image.output';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';

export class DeleteProfileImageUseCase {
	constructor(
		private readonly profileImageReader: ProfileImageReader,
		private readonly localStorageService: LocalStorageService,
	) {}

	async execute(
		input: DeleteProfileImageInput,
	): Promise<DeleteProfileImageOutput> {
		const existing = await this.profileImageReader.findByUserId(
			input.userId,
		);
		if (!existing) {
			throw new UserNotFoundException(input.userId);
		}
		this.localStorageService.deleteFile(input.fileName, input.folder);
		return { message: 'Imagen de perfil eliminada correctamente.' };
	}
}

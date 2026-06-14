import {
	ProfileImageReader,
	ProfileImageWriter,
} from 'src/domain/repositories/image_user/profile-image.repository';
import { LocalStorageService } from 'src/infrastructure/storage/local-storage.service';
import { DeleteProfileImageInput } from './delete-profile-image.input';
import { DeleteProfileImageOutput } from './delete-profile-image.output';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';

export class DeleteProfileImageUseCase {
	constructor(
		private readonly profileImageReader: ProfileImageReader,
		private readonly profileImageWriter: ProfileImageWriter,
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

		await this.localStorageService.deleteFile(existing.url, input.folder);

		await this.profileImageWriter.deleteByUserId(input.userId);

		return {
			message: 'Imagen de perfil eliminada correctamente.',
		};
	}
}

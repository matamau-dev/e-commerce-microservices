import {
	ProfileImageReader,
	ProfileImageWriter,
} from 'src/domain/repositories/image_user/profile-image.repository';
import { LocalStorageService } from 'src/infrastructure/storage/local-storage.service';
import { UploadProfileImageInput } from './upload-profile-image.input';
import { UploadProfileImageOutput } from './upload-profile-image.output';
import { ProfileImage } from 'src/domain/entities/image_user/profile-image.entity';

export class UploadProfileImageUseCase {
	constructor(
		private readonly profileImageWriter: ProfileImageWriter,
		private readonly profileImageReader: ProfileImageReader,
		private readonly localStorageService: LocalStorageService,
	) {}

	async execute(
		input: UploadProfileImageInput,
	): Promise<UploadProfileImageOutput> {
		const existing = await this.profileImageReader.findByUserId(
			input.userId,
		);

		if (existing) {
			await this.localStorageService.deleteFile(
				existing.url,
				'profile-images',
			);

			await this.profileImageWriter.deleteByUserId(input.userId);
		}

		const image = ProfileImage.create({
			userId: input.userId,
			url: input.fileName,
			nameOriginal: input.originalName,
			typeFile: input.typeFile,
		});

		const saved = await this.profileImageWriter.save(image);

		return {
			id: saved.id,
			url: this.localStorageService.getPublicUrl(saved.url, input.folder),
			nameOriginal: saved.nameOriginal,
			typeFile: saved.typeFile,
		};
	}
}

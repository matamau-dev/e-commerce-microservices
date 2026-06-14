import { LocalStorageService } from 'src/infrastructure/storage/local-storage.service';
import { GetProfileImageInput } from './get-profile-image.input';
import { GetProfileImageOutput } from './get-profile-image.output';

export class GetProfileImageUseCase {
	constructor(private readonly localStorageService: LocalStorageService) {}

	execute(input: GetProfileImageInput): GetProfileImageOutput {
		const absolutePath = this.localStorageService.getStaticImage(
			input.fileName,
			input.folder,
		);

		return {
			absolutePath,
		};
	}
}

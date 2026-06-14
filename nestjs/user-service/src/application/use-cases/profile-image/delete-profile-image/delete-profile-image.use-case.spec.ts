import { ProfileImage } from 'src/domain/entities/image_user/profile-image.entity';
import { DeleteProfileImageUseCase } from './delete-profile-image.use-case';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';

const mockProfileImageReader = {
	findByUserId: jest.fn(),
};

const mockProfileImageWriter = {
	deleteByUserId: jest.fn(),
};

const mockLocalStorageService = {
	deleteFile: jest.fn(),
};

const makeProfileImage = (
	overrides?: Partial<{
		url: string;
		nameOriginal: string;
		typeFile: string;
		userId: string;
	}>,
) =>
	ProfileImage.create({
		url: overrides?.url ?? 'profile-image.png',
		nameOriginal: overrides?.nameOriginal ?? 'original-image.png',
		typeFile: overrides?.typeFile ?? 'png',
		userId: overrides?.userId ?? 'db5dac75-2394-4c4c-b39d-ce376c2df7e8',
	});

describe('DeleteProfileImageUseCase', () => {
	let useCase: DeleteProfileImageUseCase;

	beforeEach(() => {
		jest.clearAllMocks();

		useCase = new DeleteProfileImageUseCase(
			mockProfileImageReader as any,
			mockProfileImageWriter as any,
			mockLocalStorageService as any,
		);
	});

	describe('execute', () => {
		describe('when the user does not have a profile image', () => {
			it('should throw UserNotFoundException and not invoke file storage deletion or repository deletion', async () => {
				mockProfileImageReader.findByUserId.mockResolvedValue(null);

				await expect(
					useCase.execute({
						userId: 'invalid-user-id',
						fileName: 'profile-image.png',
						folder: 'profile-images',
					}),
				).rejects.toThrow(UserNotFoundException);

				expect(mockProfileImageReader.findByUserId).toHaveBeenCalledWith(
					'invalid-user-id',
				);
				expect(mockLocalStorageService.deleteFile).not.toHaveBeenCalled();
				expect(
					mockProfileImageWriter.deleteByUserId,
				).not.toHaveBeenCalled();
			});
		});

		describe('when the user has a profile image', () => {
			it('should delete the file from storage and delete the database entry, returning a success message', async () => {
				const image = makeProfileImage({
					url: 'profile-image.png',
				});

				mockProfileImageReader.findByUserId.mockResolvedValue(image);

				const output = await useCase.execute({
					userId: image.userId,
					fileName: 'profile-image.png',
					folder: 'profile-images',
				});

				expect(mockProfileImageReader.findByUserId).toHaveBeenCalledWith(
					image.userId,
				);
				expect(mockLocalStorageService.deleteFile).toHaveBeenCalledWith(
					'profile-image.png',
					'profile-images',
				);
				expect(mockProfileImageWriter.deleteByUserId).toHaveBeenCalledWith(
					image.userId,
				);
				expect(output.message).toBe(
					'Imagen de perfil eliminada correctamente.',
				);
			});
		});

		describe('error handling and edge cases', () => {
			it('should propagate any unexpected error thrown by the profile image reader', async () => {
				mockProfileImageReader.findByUserId.mockRejectedValue(
					new Error('DB connection lost'),
				);

				await expect(
					useCase.execute({
						userId: 'user-id',
						fileName: 'profile-image.png',
						folder: 'profile-images',
					}),
				).rejects.toThrow('DB connection lost');
			});

			it('should propagate any unexpected error thrown by the local storage service', async () => {
				const image = makeProfileImage();

				mockProfileImageReader.findByUserId.mockResolvedValue(image);
				mockLocalStorageService.deleteFile.mockRejectedValue(
					new Error('Storage unavailable'),
				);

				await expect(
					useCase.execute({
						userId: image.userId,
						fileName: image.url,
						folder: 'profile-images',
					}),
				).rejects.toThrow('Storage unavailable');
			});
		});
	});
});

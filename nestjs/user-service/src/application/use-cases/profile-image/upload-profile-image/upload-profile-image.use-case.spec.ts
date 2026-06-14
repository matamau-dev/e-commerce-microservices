import { ProfileImage } from 'src/domain/entities/image_user/profile-image.entity';
import { UploadProfileImageUseCase } from './upload-profile-image.use-case';

const mockProfileImageWriter = {
	deleteByUserId: jest.fn(),
	save: jest.fn(),
};

const mockProfileImageReader = {
	findByUserId: jest.fn(),
};

const mockLocalStorageService = {
	deleteFile: jest.fn(),
	getPublicUrl: jest.fn(),
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

describe('UploadProfileImageUseCase', () => {
	let useCase: UploadProfileImageUseCase;

	beforeEach(() => {
		jest.clearAllMocks();

		mockLocalStorageService.getPublicUrl.mockImplementation(
			(fileName: string, folder: string) => `${folder}/${fileName}`,
		);

		useCase = new UploadProfileImageUseCase(
			mockProfileImageWriter as any,
			mockProfileImageReader as any,
			mockLocalStorageService as any,
		);
	});

	describe('execute', () => {
		describe('when the user does not have a prior profile image', () => {
			it('should successfully save and return the new profile image details without attempting deletion', async () => {
				mockProfileImageReader.findByUserId.mockResolvedValue(null);

				const savedImage = makeProfileImage();

				mockProfileImageWriter.save.mockResolvedValue(savedImage);

				const output = await useCase.execute({
					userId: 'db5dac75-2394-4c4c-b39d-ce376c2df7e8',
					fileName: 'profile-image.png',
					originalName: 'original-image.png',
					typeFile: 'png',
					folder: 'profile-images',
				});

				expect(mockProfileImageReader.findByUserId).toHaveBeenCalledWith(
					'db5dac75-2394-4c4c-b39d-ce376c2df7e8',
				);
				expect(mockLocalStorageService.deleteFile).not.toHaveBeenCalled();
				expect(
					mockProfileImageWriter.deleteByUserId,
				).not.toHaveBeenCalled();
				expect(mockProfileImageWriter.save).toHaveBeenCalledWith(
					expect.objectContaining({
						url: 'profile-image.png',
						nameOriginal: 'original-image.png',
						typeFile: 'png',
					}),
				);
				expect(output.id).toBe(savedImage.id);
				expect(output.url).toBe('profile-images/profile-image.png');
				expect(output.nameOriginal).toBe(savedImage.nameOriginal);
				expect(output.typeFile).toBe(savedImage.typeFile);
			});
		});

		describe('when the user already has a profile image', () => {
			it('should delete the existing profile image file and database entry, then save and return the new profile image', async () => {
				const existingImage = makeProfileImage({
					url: 'old-image.png',
				});

				mockProfileImageReader.findByUserId.mockResolvedValue(
					existingImage,
				);

				const savedImage = makeProfileImage({
					url: 'new-image.png',
				});

				mockProfileImageWriter.save.mockResolvedValue(savedImage);

				const output = await useCase.execute({
					userId: 'db5dac75-2394-4c4c-b39d-ce376c2df7e8',
					fileName: 'new-image.png',
					originalName: 'new-image.png',
					typeFile: 'png',
					folder: 'profile-images',
				});

				expect(mockLocalStorageService.deleteFile).toHaveBeenCalledWith(
					'old-image.png',
					'profile-images',
				);
				expect(mockProfileImageWriter.deleteByUserId).toHaveBeenCalledWith(
					'db5dac75-2394-4c4c-b39d-ce376c2df7e8',
				);
				expect(mockProfileImageWriter.save).toHaveBeenCalled();
				expect(output.url).toBe('profile-images/new-image.png');
			});
		});

		describe('error handling and edge cases', () => {
			it('should propagate unexpected errors thrown by the profile image reader', async () => {
				mockProfileImageReader.findByUserId.mockRejectedValue(
					new Error('DB connection lost'),
				);

				await expect(
					useCase.execute({
						userId: 'user-id',
						fileName: 'image.png',
						originalName: 'image.png',
						typeFile: 'png',
						folder: 'profile-images',
					}),
				).rejects.toThrow('DB connection lost');
			});

			it('should propagate unexpected errors thrown by the profile image writer during save', async () => {
				mockProfileImageReader.findByUserId.mockResolvedValue(null);
				mockProfileImageWriter.save.mockRejectedValue(
					new Error('Database write failed'),
				);

				await expect(
					useCase.execute({
						userId: 'user-id',
						fileName: 'image.png',
						originalName: 'image.png',
						typeFile: 'png',
						folder: 'profile-images',
					}),
				).rejects.toThrow('Database write failed');
			});
		});
	});
});

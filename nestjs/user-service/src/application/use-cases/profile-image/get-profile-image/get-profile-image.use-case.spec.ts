import { GetProfileImageUseCase } from './get-profile-image.use-case';

const mockLocalStorageService = {
	getStaticImage: jest.fn(),
};

describe('GetProfileImageUseCase', () => {
	let useCase: GetProfileImageUseCase;

	beforeEach(() => {
		jest.clearAllMocks();

		useCase = new GetProfileImageUseCase(mockLocalStorageService as any);
	});

	describe('execute', () => {
		it('should return the absolute path of the image when the image file is successfully retrieved', () => {
			mockLocalStorageService.getStaticImage.mockReturnValue(
				'/uploads/profile-images/image.png',
			);

			const output = useCase.execute({
				fileName: 'image.png',
				folder: 'profile-images',
			});

			expect(mockLocalStorageService.getStaticImage).toHaveBeenCalledWith(
				'image.png',
				'profile-images',
			);
			expect(output.absolutePath).toBe(
				'/uploads/profile-images/image.png',
			);
		});

		describe('error handling and edge cases', () => {
			it('should propagate unexpected errors thrown by the local storage service', () => {
				mockLocalStorageService.getStaticImage.mockImplementation(() => {
					throw new Error('File not found');
				});

				expect(() =>
					useCase.execute({
						fileName: 'missing.png',
						folder: 'profile-images',
					}),
				).toThrow('File not found');
			});
		});
	});
});

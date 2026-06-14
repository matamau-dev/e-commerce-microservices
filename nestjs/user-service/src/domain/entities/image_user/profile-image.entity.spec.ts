import { ProfileImage } from './profile-image.entity';

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

describe('ProfileImage Entity', () => {
	describe('create', () => {
		it('should correctly create a ProfileImage instance with a generated UUID and current date', () => {
			const profileImage = makeProfileImage();

			expect(profileImage.id).toBeDefined();
			expect(profileImage.url).toBe('profile-image.png');
			expect(profileImage.nameOriginal).toBe('original-image.png');
			expect(profileImage.typeFile).toBe('png');
			expect(profileImage.userId).toBe(
				'db5dac75-2394-4c4c-b39d-ce376c2df7e8',
			);
			expect(profileImage.createdAt).toBeInstanceOf(Date);
		});

		it('should override default properties when custom values are provided to create', () => {
			const profileImage = makeProfileImage({
				typeFile: 'jpg',
				url: 'new-image.jpg',
			});

			expect(profileImage.typeFile).toBe('jpg');
			expect(profileImage.url).toBe('new-image.jpg');
		});
	});

	describe('changeFile', () => {
		it('should update file details including url, original name, and file extension', () => {
			const profileImage = makeProfileImage();

			profileImage.changeFile({
				url: 'updated-image.webp',
				nameOriginal: 'updated-original.webp',
				typeFile: 'webp',
			});

			expect(profileImage.url).toBe('updated-image.webp');
			expect(profileImage.nameOriginal).toBe('updated-original.webp');
			expect(profileImage.typeFile).toBe('webp');
		});
	});
});

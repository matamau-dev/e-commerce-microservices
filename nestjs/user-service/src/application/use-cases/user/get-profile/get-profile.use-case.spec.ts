import { GetProfileUseCase } from './get-profile.use-case';
import { User } from 'src/domain/entities/user/user.entity';
import { RoleEnum } from 'src/domain/enums/role.enum';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';
import { Email } from 'src/domain/value-objects/user/email.value-object';
import { PhoneNumber } from 'src/domain/value-objects/utils/phone.value-object';

const mockUserReader = {
	findById: jest.fn(),
};

const mockLocalStorageService = {
	getPublicUrl: jest.fn(),
};

const makeUser = (overrides?: Partial<{ withImage: boolean }>) => {
	const user = User.create({
		name: 'Juan Pérez',
		email: new Email('juan@gmail.com'),
		phone: PhoneNumber.create('9611234567'),
		password: 'hashed_password',
		role: RoleEnum.CLIENTE,
	});

	if (overrides?.withImage) {
		Object.defineProperty(user, 'profileImages', {
			value: { url: 'uuid-foto.jpg', typeFile: 'image/jpeg' },
			writable: true,
		});
	}

	return user;
};

describe('GetProfileUseCase', () => {
	let useCase: GetProfileUseCase;

	beforeEach(() => {
		jest.clearAllMocks();
		useCase = new GetProfileUseCase(
			mockUserReader as any,
			mockLocalStorageService as any,
		);
	});

	describe('execute', () => {
		describe('when the user exists without a profile image', () => {
			it('should successfully return the profile DTO with profileImage set to null', async () => {
				const user = makeUser();
				mockUserReader.findById.mockResolvedValue(user);

				const output = await useCase.execute({ userId: user.id });

				expect(output.id).toBe(user.id);
				expect(output.name).toBe('Juan Pérez');
				expect(output.email).toBe('juan@gmail.com');
				expect(output.phone).toBe('9611234567');
				expect(output.isActive).toBe(true);
				expect(output.profileImage).toBeNull();
				expect(output.createdAt).toBeInstanceOf(Date);
			});

			it('should call userReader.findById with the correct userId', async () => {
				const user = makeUser();
				mockUserReader.findById.mockResolvedValue(user);

				await useCase.execute({ userId: user.id });

				expect(mockUserReader.findById).toHaveBeenCalledWith(user.id);
				expect(mockUserReader.findById).toHaveBeenCalledTimes(1);
			});
		});

		describe('when the user exists with a profile image', () => {
			it('should return the public URL of the profile image along with profile details', async () => {
				const user = makeUser({ withImage: true });
				mockUserReader.findById.mockResolvedValue(user);
				mockLocalStorageService.getPublicUrl.mockReturnValue(
					'http://localhost:3001/api/v1/users/profile-image/profile-images/uuid-foto.jpg',
				);

				const output = await useCase.execute({ userId: user.id });

				expect(output.profileImage).toEqual({
					url: 'http://localhost:3001/api/v1/users/profile-image/profile-images/uuid-foto.jpg',
					type: 'image/jpeg',
				});
				expect(mockLocalStorageService.getPublicUrl).toHaveBeenCalledWith(
					'uuid-foto.jpg',
					'profile-images',
				);
			});
		});

		describe('when the user does not exist', () => {
			it('should throw UserNotFoundException', async () => {
				mockUserReader.findById.mockResolvedValue(null);

				await expect(
					useCase.execute({ userId: 'uuid-inexistente' }),
				).rejects.toThrow(UserNotFoundException);
			});

			it('should throw UserNotFoundException with the specific userId in its message', async () => {
				mockUserReader.findById.mockResolvedValue(null);

				await expect(
					useCase.execute({ userId: 'uuid-inexistente' }),
				).rejects.toThrow('uuid-inexistente');
			});

			it('should not call the local storage service', async () => {
				mockUserReader.findById.mockResolvedValue(null);

				await expect(
					useCase.execute({ userId: 'uuid-inexistente' }),
				).rejects.toThrow();

				expect(mockLocalStorageService.getPublicUrl).not.toHaveBeenCalled();
			});
		});

		describe('error handling and edge cases', () => {
			it('should propagate unexpected repository errors thrown by user reader', async () => {
				mockUserReader.findById.mockRejectedValue(
					new Error('DB connection lost'),
				);

				await expect(useCase.execute({ userId: 'any-id' })).rejects.toThrow(
					'DB connection lost',
				);
			});
		});
	});
});

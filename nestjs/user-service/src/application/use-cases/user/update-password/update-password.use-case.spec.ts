import { User } from 'src/domain/entities/user/user.entity';
import { RoleEnum } from 'src/domain/enums/role.enum';
import { InvalidPasswordException } from 'src/domain/exceptions/user/invalid-password.exception';
import { SamePasswordException } from 'src/domain/exceptions/user/same-password.exception';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';
import { Email } from 'src/domain/value-objects/user/email.value-object';
import { PhoneNumber } from 'src/domain/value-objects/utils/phone.value-object';
import { UpdatePasswordUseCase } from './update-password.use-case';

const mockUserReader = {
	findById: jest.fn(),
};

const mockUserWriter = {
	update: jest.fn(),
};

const mockHashService = {
	compare: jest.fn(),
	hash: jest.fn(),
};

const makeUser = () =>
	User.create({
		name: 'Juan Pérez',
		email: new Email('juan.perez@example.com'),
		phone: new PhoneNumber('+1234567890'),
		password: 'hashed_password',
		role: RoleEnum.CLIENTE,
	});

describe('UpdatePasswordUseCase', () => {
	let useCase: UpdatePasswordUseCase;

	beforeEach(() => {
		jest.clearAllMocks();

		useCase = new UpdatePasswordUseCase(
			mockUserReader as any,
			mockUserWriter as any,
			mockHashService as any,
		);
	});

	describe('execute', () => {
		describe('when the user does not exist', () => {
			it('should throw UserNotFoundException and not check password or save updates', async () => {
				mockUserReader.findById.mockResolvedValue(null);

				await expect(
					useCase.execute({
						userId: 'invalid-id',
						currentPassword: 'plain-password',
						newPassword: 'new-password',
					}),
				).rejects.toThrow(UserNotFoundException);

				expect(mockUserReader.findById).toHaveBeenCalledWith('invalid-id');
				expect(mockHashService.compare).not.toHaveBeenCalled();
				expect(mockUserWriter.update).not.toHaveBeenCalled();
			});
		});

		describe('when the current password is invalid', () => {
			it('should throw InvalidPasswordException and not save updates', async () => {
				const user = makeUser();

				mockUserReader.findById.mockResolvedValue(user);
				mockHashService.compare.mockResolvedValue(false);

				await expect(
					useCase.execute({
						userId: user.id,
						currentPassword: 'wrong-password',
						newPassword: 'new-password',
					}),
				).rejects.toThrow(InvalidPasswordException);

				expect(mockHashService.compare).toHaveBeenCalledWith(
					'wrong-password',
					user.password,
				);
				expect(mockUserWriter.update).not.toHaveBeenCalled();
			});
		});

		describe('when the new password is the same as the current password', () => {
			it('should throw SamePasswordException and not update password', async () => {
				const user = makeUser();

				mockUserReader.findById.mockResolvedValue(user);
				mockHashService.compare
					.mockResolvedValueOnce(true)
					.mockResolvedValueOnce(true);

				await expect(
					useCase.execute({
						userId: user.id,
						currentPassword: 'correct-password',
						newPassword: 'correct-password',
					}),
				).rejects.toThrow(SamePasswordException);

				expect(mockHashService.compare).toHaveBeenNthCalledWith(
					1,
					'correct-password',
					user.password,
				);
				expect(mockHashService.compare).toHaveBeenNthCalledWith(
					2,
					'correct-password',
					user.password,
				);
				expect(mockUserWriter.update).not.toHaveBeenCalled();
			});
		});

		describe('when valid and unique credentials are provided', () => {
			it('should hash the new password, save the user, and return a success message', async () => {
				const user = makeUser();

				mockUserReader.findById.mockResolvedValue(user);
				mockHashService.compare
					.mockResolvedValueOnce(true)
					.mockResolvedValueOnce(false);
				mockHashService.hash.mockResolvedValue('new_hashed_password');

				const output = await useCase.execute({
					userId: user.id,
					currentPassword: 'correct-password',
					newPassword: 'new-password',
				});

				expect(mockHashService.hash).toHaveBeenCalledWith('new-password');
				expect(mockUserWriter.update).toHaveBeenCalledWith(
					expect.objectContaining({
						id: user.id,
						password: 'new_hashed_password',
					}),
				);
				expect(output.message).toBe('Contraseña actualizada correctamente');
			});
		});

		describe('error handling and edge cases', () => {
			it('should propagate unexpected errors thrown by user reader', async () => {
				mockUserReader.findById.mockRejectedValue(
					new Error('DB connection lost'),
				);

				await expect(
					useCase.execute({
						userId: 'any-id',
						currentPassword: 'password',
						newPassword: 'new-password',
					}),
				).rejects.toThrow('DB connection lost');
			});

			it('should propagate unexpected errors thrown by user writer', async () => {
				const user = makeUser();

				mockUserReader.findById.mockResolvedValue(user);
				mockHashService.compare
					.mockResolvedValueOnce(true)
					.mockResolvedValueOnce(false);
				mockHashService.hash.mockResolvedValue('new_hashed_password');
				mockUserWriter.update.mockRejectedValue(
					new Error('Database write failed'),
				);

				await expect(
					useCase.execute({
						userId: user.id,
						currentPassword: 'correct-password',
						newPassword: 'new-password',
					}),
				).rejects.toThrow('Database write failed');
			});
		});
	});
});

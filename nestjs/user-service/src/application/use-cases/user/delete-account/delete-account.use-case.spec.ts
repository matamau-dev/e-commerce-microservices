import { DeleteAccountUseCase } from './delete-account.use-case';
import { User } from 'src/domain/entities/user/user.entity';
import { RoleEnum } from 'src/domain/enums/role.enum';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';
import { InvalidPasswordException } from 'src/domain/exceptions/user/invalid-password.exception';
import { Email } from 'src/domain/value-objects/user/email.value-object';
import { PhoneNumber } from 'src/domain/value-objects/utils/phone.value-object';

const mockUserReader = {
	findById: jest.fn(),
};

const mockUserWriter = {
	softDelete: jest.fn(),
};

const mockHashService = {
	compare: jest.fn(),
};

const makeUser = () =>
	User.create({
		name: 'Juan Pérez',
		email: new Email('juan.perez@example.com'),
		phone: new PhoneNumber('+1234567890'),
		password: 'hashed_password',
		role: RoleEnum.CLIENTE,
	});

describe('DeleteAccountUseCase', () => {
	let useCase: DeleteAccountUseCase;

	beforeEach(() => {
		jest.clearAllMocks();

		mockHashService.compare.mockResolvedValue(true);

		useCase = new DeleteAccountUseCase(
			mockUserReader as any,
			mockUserWriter as any,
			mockHashService as any,
		);
	});

	describe('execute', () => {
		describe('when the user does not exist', () => {
			it('should throw UserNotFoundException and not compare password or delete account', async () => {
				mockUserReader.findById.mockResolvedValue(null);

				await expect(
					useCase.execute({
						userId: 'invalid-id',
						password: 'plain-password',
					}),
				).rejects.toThrow(UserNotFoundException);

				expect(mockUserReader.findById).toHaveBeenCalledWith('invalid-id');
				expect(mockHashService.compare).not.toHaveBeenCalled();
				expect(mockUserWriter.softDelete).not.toHaveBeenCalled();
			});
		});

		describe('when the password is invalid', () => {
			it('should throw InvalidPasswordException and not delete account', async () => {
				const user = makeUser();

				mockUserReader.findById.mockResolvedValue(user);
				mockHashService.compare.mockResolvedValue(false);

				await expect(
					useCase.execute({
						userId: user.id,
						password: 'wrong-password',
					}),
				).rejects.toThrow(InvalidPasswordException);

				expect(mockHashService.compare).toHaveBeenCalledWith(
					'wrong-password',
					user.password,
				);
				expect(mockUserWriter.softDelete).not.toHaveBeenCalled();
			});
		});

		describe('when valid credentials are provided', () => {
			it('should perform soft delete and return success message with deletedDate', async () => {
				const user = makeUser();

				mockUserReader.findById.mockResolvedValue(user);

				const output = await useCase.execute({
					userId: user.id,
					password: 'plain-password',
				});

				expect(mockUserReader.findById).toHaveBeenCalledWith(user.id);
				expect(mockHashService.compare).toHaveBeenCalledWith(
					'plain-password',
					user.password,
				);
				expect(mockUserWriter.softDelete).toHaveBeenCalledWith(user.id);
				expect(output.message).toBe('Cuenta eliminada correctamente');
				expect(output.deletedAt).toBeInstanceOf(Date);
			});
		});

		describe('error handling and edge cases', () => {
			it('should propagate unexpected errors thrown by the user reader', async () => {
				mockUserReader.findById.mockRejectedValue(
					new Error('DB connection lost'),
				);

				await expect(
					useCase.execute({
						userId: 'any-id',
						password: 'plain-password',
					}),
				).rejects.toThrow('DB connection lost');
			});

			it('should propagate unexpected errors thrown by the user writer', async () => {
				const user = makeUser();

				mockUserReader.findById.mockResolvedValue(user);
				mockUserWriter.softDelete.mockRejectedValue(
					new Error('Database write failed'),
				);

				await expect(
					useCase.execute({
						userId: user.id,
						password: 'plain-password',
					}),
				).rejects.toThrow('Database write failed');
			});
		});
	});
});

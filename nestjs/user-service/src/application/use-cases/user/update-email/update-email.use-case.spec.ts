import { User } from 'src/domain/entities/user/user.entity';
import { RoleEnum } from 'src/domain/enums/role.enum';
import { Email } from 'src/domain/value-objects/user/email.value-object';
import { PhoneNumber } from 'src/domain/value-objects/utils/phone.value-object';
import { UpdateEmailUseCase } from './update-email.use-case';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';
import { InvalidPasswordException } from 'src/domain/exceptions/user/invalid-password.exception';
import { EmailAlreadyExistsException } from 'src/domain/exceptions/user/email-already-exists.exception';

const mockUserReader = {
	findById: jest.fn(),
};

const mockUserVerification = {
	existByEmail: jest.fn(),
	existByPhone: jest.fn(),
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

describe('UpdateEmailUseCase', () => {
	let useCase: UpdateEmailUseCase;

	beforeEach(() => {
		jest.clearAllMocks();

		mockUserVerification.existByEmail.mockResolvedValue(false);
		mockUserVerification.existByPhone.mockResolvedValue(false);
		mockHashService.compare.mockResolvedValue(true);

		useCase = new UpdateEmailUseCase(
			mockUserReader as any,
			mockUserVerification as any,
			mockHashService as any,
		);
	});

	describe('execute', () => {
		describe('when the user does not exist', () => {
			it('should throw UserNotFoundException', async () => {
				mockUserReader.findById.mockResolvedValue(null);

				await expect(
					useCase.execute({
						newEmail: 'newemail@example.com',
						password: 'plain-password',
						userId: 'invalid-id',
					}),
				).rejects.toThrow(UserNotFoundException);
			});
		});

		describe('when the password is invalid', () => {
			it('should throw InvalidPasswordException and not check if email exists', async () => {
				const user = makeUser();

				mockUserReader.findById.mockResolvedValue(user);
				mockHashService.compare.mockResolvedValue(false);

				await expect(
					useCase.execute({
						userId: user.id,
						password: 'wrong-password',
						newEmail: 'newemail@example.com',
					}),
				).rejects.toThrow(InvalidPasswordException);

				expect(mockHashService.compare).toHaveBeenCalledWith(
					'wrong-password',
					user.password,
				);
			});
		});

		describe('when the new email already exists', () => {
			it('should throw EmailAlreadyExistsException and not proceed with update', async () => {
				const user = makeUser();

				mockUserReader.findById.mockResolvedValue(user);
				mockHashService.compare.mockResolvedValue(true);
				mockUserVerification.existByEmail.mockResolvedValue(true);

				await expect(
					useCase.execute({
						userId: user.id,
						newEmail: 'exist@example.com',
						password: 'correct-password',
					}),
				).rejects.toThrow(EmailAlreadyExistsException);

				expect(mockHashService.compare).toHaveBeenCalledWith(
					'correct-password',
					user.password,
				);
				expect(mockUserVerification.existByEmail).toHaveBeenCalledWith(
					'exist@example.com',
				);
			});
		});

		describe('when the email is unique and credentials are valid', () => {
			it('should return a verification email message', async () => {
				const user = makeUser();

				mockUserReader.findById.mockResolvedValue(user);
				mockHashService.compare.mockResolvedValue(true);
				mockUserVerification.existByEmail.mockResolvedValue(false);

				const output = await useCase.execute({
					userId: user.id,
					password: 'correct-password',
					newEmail: 'newemail@example.com',
				});

				expect(output.message).toBe(
					'Te enviamos un correo de verificación',
				);
			});
		});
	});
});

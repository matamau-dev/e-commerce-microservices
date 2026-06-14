import { User } from 'src/domain/entities/user/user.entity';
import { RoleEnum } from 'src/domain/enums/role.enum';
import { EmailAlreadyExistsException } from 'src/domain/exceptions/user/email-already-exists.exception';
import { PhoneAlreadyExistsException } from 'src/domain/exceptions/user/phone-already-exists.exception';
import { Email } from 'src/domain/value-objects/user/email.value-object';
import { PhoneNumber } from 'src/domain/value-objects/utils/phone.value-object';
import { RegisterClientUseCase } from './register-client.use-case';

const mockUserWriter = {
	create: jest.fn(),
};

const mockUserVerification = {
	existByEmail: jest.fn(),
	existByPhone: jest.fn(),
};

const mockHashService = {
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

describe('RegisterClientUseCase', () => {
	let useCase: RegisterClientUseCase;

	beforeEach(() => {
		jest.clearAllMocks();

		mockUserVerification.existByEmail.mockResolvedValue(false);
		mockUserVerification.existByPhone.mockResolvedValue(false);
		mockHashService.hash.mockResolvedValue('hashed_password');

		useCase = new RegisterClientUseCase(
			mockUserWriter as any,
			mockUserVerification as any,
			mockHashService as any,
		);
	});

	describe('execute', () => {
		describe('when the email address already exists', () => {
			it('should throw EmailAlreadyExistsException and not hash password or create user', async () => {
				const user = makeUser();

				mockUserVerification.existByEmail.mockResolvedValue(true);

				await expect(
					useCase.execute({
						name: user.name,
						email: user.email.getValue(),
						phone: user.phone.getValue(),
						password: 'password',
					}),
				).rejects.toThrow(EmailAlreadyExistsException);

				expect(mockHashService.hash).not.toHaveBeenCalled();
				expect(mockUserWriter.create).not.toHaveBeenCalled();
			});
		});

		describe('when the phone number already exists', () => {
			it('should throw PhoneAlreadyExistsException and not hash password or create user', async () => {
				const user = makeUser();

				mockUserVerification.existByPhone.mockResolvedValue(true);

				await expect(
					useCase.execute({
						name: user.name,
						email: user.email.getValue(),
						phone: user.phone.getValue(),
						password: 'password',
					}),
				).rejects.toThrow(PhoneAlreadyExistsException);

				expect(mockHashService.hash).not.toHaveBeenCalled();
				expect(mockUserWriter.create).not.toHaveBeenCalled();
			});
		});

		describe('when the registration data is unique and valid', () => {
			it('should hash the password, save the new client, and return the client DTO details', async () => {
				const user = makeUser();

				const output = await useCase.execute({
					name: user.name,
					email: user.email.getValue(),
					phone: user.phone.getValue(),
					password: 'password',
				});

				expect(mockUserVerification.existByEmail).toHaveBeenCalledWith(
					user.email.getValue(),
				);
				expect(mockUserVerification.existByPhone).toHaveBeenCalledWith(
					user.phone.getValue(),
				);
				expect(mockHashService.hash).toHaveBeenCalledWith('password');
				expect(mockUserWriter.create).toHaveBeenCalledWith(
					expect.objectContaining({
						name: user.name,
						password: 'hashed_password',
						role: RoleEnum.CLIENTE,
						isActive: false,
					}),
				);
				expect(output.id).toBeDefined();
				expect(output.name).toBe(user.name);
				expect(output.email).toBe(user.email.getValue());
				expect(output.phone).toBe(user.phone.getValue());
				expect(output.createdAt).toBeInstanceOf(Date);
			});
		});

		describe('error handling and edge cases', () => {
			it('should propagate unexpected database errors thrown by user writer', async () => {
				const user = makeUser();

				mockUserWriter.create.mockRejectedValue(
					new Error('Database error'),
				);

				await expect(
					useCase.execute({
						name: user.name,
						email: user.email.getValue(),
						phone: user.phone.getValue(),
						password: 'password',
					}),
				).rejects.toThrow('Database error');
			});
		});
	});
});

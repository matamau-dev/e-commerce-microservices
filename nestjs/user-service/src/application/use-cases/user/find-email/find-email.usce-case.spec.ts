import { User } from 'src/domain/entities/user/user.entity';
import { RoleEnum } from 'src/domain/enums/role.enum';
import { Email } from 'src/domain/value-objects/user/email.value-object';
import { PhoneNumber } from 'src/domain/value-objects/utils/phone.value-object';
import { FindEmailUseCase } from './find-email.use-case';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';

const mockUserReader = {
	findByEmail: jest.fn(),
};

const makeUser = (overrides?: Partial<{ email: string }>) =>
	User.create({
		name: 'Juan Pérez',
		email: new Email('juan@gmail.com'),
		phone: PhoneNumber.create('9611234567'),
		password: 'hashed_password',
		role: RoleEnum.CLIENTE,
	});

describe('FindEmailUseCase', () => {
	let useCase: FindEmailUseCase;

	beforeEach(() => {
		jest.clearAllMocks();
		useCase = new FindEmailUseCase(mockUserReader as any);
	});

	describe('execute', () => {
		describe('when the user exists', () => {
			it('should successfully return the user data DTO', async () => {
				const user = makeUser();
				mockUserReader.findByEmail.mockResolvedValue(user);

				const output = await useCase.execute({ email: 'juan@gmail.com' });

				expect(output.id).toBe(user.id);
				expect(output.email).toBe('juan@gmail.com');
				expect(output.password).toBe('hashed_password');
				expect(output.role).toBe(RoleEnum.CLIENTE);
				expect(output.isActive).toBe(true);
			});

			it('should invoke findByEmail with the correct email address', async () => {
				const user = makeUser();
				mockUserReader.findByEmail.mockResolvedValue(user);

				await useCase.execute({ email: 'juan@gmail.com' });

				expect(mockUserReader.findByEmail).toHaveBeenCalledWith(
					'juan@gmail.com',
				);
				expect(mockUserReader.findByEmail).toHaveBeenCalledTimes(1);
			});
		});

		describe('when the user does not exist', () => {
			it('should throw UserNotFoundException', async () => {
				mockUserReader.findByEmail.mockResolvedValue(null);

				await expect(
					useCase.execute({ email: 'juan@gmail.com' }),
				).rejects.toThrow(UserNotFoundException);
			});
		});

		describe('error handling and edge cases', () => {
			it('should propagate unexpected database errors thrown by user reader', async () => {
				mockUserReader.findByEmail.mockRejectedValue(
					new Error('DB connection lost'),
				);

				await expect(
					useCase.execute({ email: 'juan@gmail.com' }),
				).rejects.toThrow('DB connection lost');
			});
		});
	});
});

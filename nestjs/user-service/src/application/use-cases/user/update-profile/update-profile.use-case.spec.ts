import { User } from 'src/domain/entities/user/user.entity';
import { RoleEnum } from 'src/domain/enums/role.enum';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';
import { Email } from 'src/domain/value-objects/user/email.value-object';
import { PhoneNumber } from 'src/domain/value-objects/utils/phone.value-object';
import { UpdateProfileUsecase } from './update-profile.use-case';

const mockUserReader = {
	findById: jest.fn(),
};

const mockUserWriter = {
	update: jest.fn(),
};

const makeUser = () =>
	User.create({
		name: 'Juan Pérez',
		email: new Email('juan.perez@example.com'),
		phone: new PhoneNumber('+1234567890'),
		password: 'hashed_password',
		role: RoleEnum.CLIENTE,
	});

describe('UpdateProfileUseCase', () => {
	let useCase: UpdateProfileUsecase;

	beforeEach(() => {
		jest.clearAllMocks();

		mockUserWriter.update.mockImplementation(async (user) => user);

		useCase = new UpdateProfileUsecase(
			mockUserReader as any,
			mockUserWriter as any,
		);
	});

	describe('execute', () => {
		describe('when the user does not exist', () => {
			it('should throw UserNotFoundException and not perform updates', async () => {
				mockUserReader.findById.mockResolvedValue(null);

				await expect(
					useCase.execute({
						userId: 'invalid-id',
						name: 'Marco Suarez',
						phone: '9616923388',
					}),
				).rejects.toThrow(UserNotFoundException);

				expect(mockUserReader.findById).toHaveBeenCalledWith('invalid-id');
				expect(mockUserWriter.update).not.toHaveBeenCalled();
			});
		});

		describe('when the user exists', () => {
			it('should update both the name and phone number correctly', async () => {
				const user = makeUser();

				mockUserReader.findById.mockResolvedValue(user);

				const output = await useCase.execute({
					userId: user.id,
					name: 'Marco Suarez',
					phone: '9818764433',
				});

				expect(mockUserReader.findById).toHaveBeenCalledWith(user.id);
				expect(mockUserWriter.update).toHaveBeenCalledWith(
					expect.objectContaining({
						id: user.id,
						name: 'Marco Suarez',
						phone: expect.any(PhoneNumber),
					}),
				);
				expect(output.id).toBe(user.id);
				expect(output.name).toBe('Marco Suarez');
				expect(output.email).toBe(user.email.getValue());
				expect(output.phone).toBe('9818764433');
			});

			it('should update only the name when phone is not provided', async () => {
				const user = makeUser();

				mockUserReader.findById.mockResolvedValue(user);

				const output = await useCase.execute({
					userId: user.id,
					name: 'Marco Suarez',
				});

				expect(mockUserWriter.update).toHaveBeenCalledWith(
					expect.objectContaining({
						id: user.id,
						name: 'Marco Suarez',
					}),
				);
				expect(output.name).toBe('Marco Suarez');
				expect(output.phone).toBe('+1234567890');
			});

			it('should update only the phone number when name is not provided', async () => {
				const user = makeUser();

				mockUserReader.findById.mockResolvedValue(user);

				const output = await useCase.execute({
					userId: user.id,
					phone: '9861427499',
				});

				expect(mockUserWriter.update).toHaveBeenCalledWith(
					expect.objectContaining({
						id: user.id,
						name: 'Juan Pérez',
						phone: expect.any(PhoneNumber),
					}),
				);
				expect(output.name).toBe('Juan Pérez');
				expect(output.phone).toBe('9861427499');
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
					}),
				).rejects.toThrow('DB connection lost');
			});

			it('should propagate unexpected errors thrown by user writer', async () => {
				const user = makeUser();

				mockUserReader.findById.mockResolvedValue(user);
				mockUserWriter.update.mockRejectedValue(
					new Error('Database write failed'),
				);

				await expect(
					useCase.execute({
						userId: user.id,
						name: 'Marco Suarez',
					}),
				).rejects.toThrow('Database write failed');
			});
		});
	});
});

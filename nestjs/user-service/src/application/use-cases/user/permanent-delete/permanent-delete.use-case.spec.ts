import { User } from 'src/domain/entities/user/user.entity';
import { RoleEnum } from 'src/domain/enums/role.enum';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';
import { Email } from 'src/domain/value-objects/user/email.value-object';
import { PhoneNumber } from 'src/domain/value-objects/utils/phone.value-object';
import { PermanentDeleteUseCase } from './permanent-delete.use-case';

const mockUserReader = {
	findById: jest.fn(),
};

const mockUserWriter = {
	permanentDelete: jest.fn(),
};

const makeUser = () =>
	User.create({
		name: 'Juan Pérez',
		email: new Email('juan.perez@example.com'),
		phone: new PhoneNumber('+1234567890'),
		password: 'hashed_password',
		role: RoleEnum.CLIENTE,
	});

describe('PermanentDeleteUseCase', () => {
	let useCase: PermanentDeleteUseCase;

	beforeEach(() => {
		jest.clearAllMocks();

		useCase = new PermanentDeleteUseCase(
			mockUserReader as any,
			mockUserWriter as any,
		);
	});

	describe('execute', () => {
		describe('when the target user does not exist', () => {
			it('should throw UserNotFoundException and not perform permanent deletion', async () => {
				mockUserReader.findById.mockResolvedValue(null);

				await expect(
					useCase.execute({
						adminId: 'invalid-id',
						targetUserId: 'invalid-user-id',
					}),
				).rejects.toThrow(UserNotFoundException);

				expect(mockUserReader.findById).toHaveBeenCalledWith(
					'invalid-user-id',
				);
				expect(mockUserWriter.permanentDelete).not.toHaveBeenCalled();
			});
		});

		describe('when the target user exists', () => {
			it('should permanently delete the user and return a success message', async () => {
				const user = makeUser();

				mockUserReader.findById.mockResolvedValue(user);

				const output = await useCase.execute({
					adminId: 'valid-id',
					targetUserId: user.id,
				});

				expect(mockUserReader.findById).toHaveBeenCalledWith(user.id);
				expect(mockUserWriter.permanentDelete).toHaveBeenCalledWith(
					user.id,
				);
				expect(output.message).toBe('Usuario eliminado permanentemente');
			});
		});

		describe('error handling and edge cases', () => {
			it('should propagate unexpected errors thrown by user reader', async () => {
				mockUserReader.findById.mockRejectedValue(
					new Error('DB connection lost'),
				);

				await expect(
					useCase.execute({
						adminId: 'any-id',
						targetUserId: 'any-user-id',
					}),
				).rejects.toThrow('DB connection lost');
			});

			it('should propagate unexpected errors thrown by user writer', async () => {
				const user = makeUser();

				mockUserReader.findById.mockResolvedValue(user);
				mockUserWriter.permanentDelete.mockRejectedValue(
					new Error('Database write failed'),
				);

				await expect(
					useCase.execute({
						adminId: 'any-id',
						targetUserId: user.id,
					}),
				).rejects.toThrow('Database write failed');
			});
		});
	});
});

import { makeAddress } from 'test/factory/address.factory';
import { NewAddressUseCase } from './new-address.use-cases';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';

describe('NewAddressUseCase', () => {
	let addressWriter: any;
	let addressReader: any;
	let userReader: any;
	let useCase: NewAddressUseCase;

	beforeEach(() => {
		addressWriter = {
			create: jest.fn(),
			update: jest.fn(),
		};

		addressReader = {
			findDefaultByUserId: jest.fn(),
		};

		userReader = {
			findById: jest.fn(),
		};

		useCase = new NewAddressUseCase(
			addressWriter,
			addressReader,
			userReader,
		);
	});

	describe('execute', () => {
		it('should create and save a new address when valid data is provided', async () => {
			userReader.findById.mockResolvedValue({
				id: 'user-id',
				name: 'Mauricio',
			});

			addressReader.findDefaultByUserId.mockResolvedValue(null);

			const result = await useCase.execute({
				userId: 'user-id',
				fullName: 'Juan Pérez',
				phone: '9611234567',
				isDefault: false,
				location: {
					street: 'Central',
					externalNumber: '123',
					neighborhood: 'Centro',
					city: 'Tuxtla',
					state: 'Chiapas',
					postalCode: '29000',
				},
			});

			expect(addressWriter.create).toHaveBeenCalled();
			expect(result.fullName).toBe('Juan Pérez');
			expect(result.location.city).toBe('Tuxtla');
		});

		it('should mark the previous default address as non-default and save it when the new address is marked as default', async () => {
			const currentDefault = makeAddress({
				isDefault: true,
			});

			userReader.findById.mockResolvedValue({
				id: 'user-id',
				name: 'Mauricio',
			});

			addressReader.findDefaultByUserId.mockResolvedValue(currentDefault);

			await useCase.execute({
				userId: 'user-id',
				fullName: 'Juan',
				phone: '9611234567',
				isDefault: true,
				location: {
					street: 'Central',
					externalNumber: '123',
					neighborhood: 'Centro',
					city: 'Tuxtla',
					state: 'Chiapas',
					postalCode: '29000',
				},
			});

			expect(currentDefault.isDefault).toBe(false);
			expect(addressWriter.update).toHaveBeenCalledWith(currentDefault);
		});

		it('should throw UserNotFoundException when the user does not exist', async () => {
			userReader.findById.mockResolvedValue(null);

			await expect(
				useCase.execute({
					userId: 'user-id',
					fullName: 'Juan',
					phone: '9611234567',
					isDefault: false,
					location: {
						street: 'Central',
						externalNumber: '123',
						neighborhood: 'Centro',
						city: 'Tuxtla',
						state: 'Chiapas',
						postalCode: '29000',
					},
				}),
			).rejects.toThrow(UserNotFoundException);
		});
	});
});

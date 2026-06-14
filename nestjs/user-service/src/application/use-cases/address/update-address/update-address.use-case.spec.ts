import { AddressNotFoundException } from 'src/domain/exceptions/address/address-not-found.exception';
import { UpdateAddressUseCase } from './update-address.use-case';
import { makeAddress } from 'test/factory/address.factory';
import { AddressNotOwnedByUserException } from 'src/domain/exceptions/address/address-not-owned-by-user.exception';

describe('UpdateAddressUseCase', () => {
	let addressWriter: any;
	let addressReader: any;
	let useCase: UpdateAddressUseCase;

	beforeEach(() => {
		addressWriter = {
			update: jest.fn(),
			clearDefaultByUserId: jest.fn(),
		};

		addressReader = {
			findById: jest.fn(),
		};

		useCase = new UpdateAddressUseCase(addressWriter, addressReader);
	});

	describe('execute', () => {
		it('should update the address properties when it exists and belongs to the user', async () => {
			const address = makeAddress();

			addressReader.findById.mockResolvedValue(address);

			const result = await useCase.execute({
				id: address.id,
				userId: address.userId,
				fullName: 'Nuevo Nombre',
				phone: '9619999999',
				references: 'Nueva referencia',
				location: {
					street: 'Nueva calle',
					externalNumber: '999',
					neighborhood: 'Centro',
					city: 'Tuxtla',
					state: 'Chiapas',
					postalCode: '29000',
				},
			});

			expect(addressWriter.update).toHaveBeenCalledWith(address);
			expect(result.fullName).toBe('Nuevo Nombre');
			expect(result.phone).toBe('9619999999');
			expect(result.references).toBe('Nueva referencia');
			expect(result.location.street).toBe('Nueva calle');
		});

		it('should mark the address as default and clear previous defaults for the user', async () => {
			const address = makeAddress({
				isDefault: false,
			});

			addressReader.findById.mockResolvedValue(address);

			await useCase.execute({
				id: address.id,
				userId: address.userId,
				isDefault: true,
			});

			expect(addressWriter.clearDefaultByUserId).toHaveBeenCalledWith(
				address.userId,
			);
			expect(address.isDefault).toBe(true);
			expect(addressWriter.update).toHaveBeenCalledWith(address);
		});

		it('should throw AddressNotFoundException when the address does not exist', async () => {
			addressReader.findById.mockResolvedValue(null);

			await expect(
				useCase.execute({
					id: 'invalid-id',
					userId: 'user-id',
				}),
			).rejects.toThrow(AddressNotFoundException);
		});

		it('should throw AddressNotOwnedByUserException when the address belongs to another user', async () => {
			const address = makeAddress({
				userId: 'owner-id',
			});

			addressReader.findById.mockResolvedValue(address);

			await expect(
				useCase.execute({
					id: address.id,
					userId: 'otro-user',
				}),
			).rejects.toThrow(AddressNotOwnedByUserException);
		});
	});
});

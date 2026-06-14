import { makeAddress } from 'test/factory/address.factory';
import { SoftDeleteAddressUseCase } from './soft-delete-address.usecase';
import { AddressNotFoundException } from 'src/domain/exceptions/address/address-not-found.exception';
import { AddressNotOwnedByUserException } from 'src/domain/exceptions/address/address-not-owned-by-user.exception';

describe('SoftDeleteAddressUseCase', () => {
	let addressWriter: any;
	let addressReader: any;
	let useCase: SoftDeleteAddressUseCase;

	beforeEach(() => {
		addressWriter = {
			softDelete: jest.fn(),
		};

		addressReader = {
			findById: jest.fn(),
		};

		useCase = new SoftDeleteAddressUseCase(addressWriter, addressReader);
	});

	describe('execute', () => {
		it('should soft delete the address when it exists and belongs to the user', async () => {
			const address = makeAddress();

			addressReader.findById.mockResolvedValue(address);

			const result = await useCase.execute({
				id: address.id,
				userId: address.userId,
			});

			expect(addressReader.findById).toHaveBeenCalledWith(address.id);
			expect(addressWriter.softDelete).toHaveBeenCalledWith(address.id);
			expect(result).toEqual({
				message: 'Dirección eliminado',
			});
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

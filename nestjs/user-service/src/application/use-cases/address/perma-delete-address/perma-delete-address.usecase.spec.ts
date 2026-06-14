import { makeAddress } from 'test/factory/address.factory';
import { PermaDeleteAddressUseCase } from './perma-delete-address.usecase';
import { AddressNotFoundException } from 'src/domain/exceptions/address/address-not-found.exception';

describe('PermaDeleteAddressUseCase', () => {
	let addressWriter: any;
	let addressReader: any;
	let useCase: PermaDeleteAddressUseCase;

	beforeEach(() => {
		addressWriter = {
			permanentDelete: jest.fn(),
		};

		addressReader = {
			findById: jest.fn(),
		};

		useCase = new PermaDeleteAddressUseCase(addressWriter, addressReader);
	});

	describe('execute', () => {
		it('should permanently delete the address when it exists', async () => {
			const address = makeAddress();

			addressReader.findById.mockResolvedValue(address);

			const result = await useCase.execute({
				id: address.id,
				userId: 'user-id',
			});

			expect(addressReader.findById).toHaveBeenCalledWith(address.id);
			expect(addressWriter.permanentDelete).toHaveBeenCalledWith(address.id);
			expect(result).toEqual({
				message: 'Dirección eliminada permanentemente',
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
	});
});

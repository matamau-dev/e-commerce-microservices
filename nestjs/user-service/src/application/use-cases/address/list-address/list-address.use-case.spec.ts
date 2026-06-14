import { makeAddress } from 'test/factory/address.factory';
import { ListAddressesUseCase } from './list-address.use-case';

describe('ListAddressesUseCase', () => {
	let addressReader: any;
	let useCase: ListAddressesUseCase;

	beforeEach(() => {
		addressReader = {
			findAll: jest.fn(),
		};

		useCase = new ListAddressesUseCase(addressReader);
	});

	describe('execute', () => {
		it('should return a list of mapped address DTOs when addresses exist for the user', async () => {
			const address = makeAddress();

			addressReader.findAll.mockResolvedValue({
				data: [address],
				total: 1,
				page: 1,
				limit: 10,
			});

			const result = await useCase.execute({
				userId: 'user-id',
				query: {},
			});

			expect(addressReader.findAll).toHaveBeenCalledWith('user-id', {});
			expect(result.data.length).toBe(1);
			expect(result.data[0]).toEqual({
				id: address.id,
				fullName: address.fullName,
				phone: address.phone.getValue(),
				location: {
					street: address.location.street,
					externalNumber: address.location.externalNumber,
					neighborhood: address.location.neighborhood,
					city: address.location.city,
					state: address.location.state,
					postalCode: address.location.postalCode.getValue(),
				},
				isDefault: address.isDefault,
				createAt: address.createdAt,
				internalNumber: address.location.internalNumber,
				references: address.references,
				updatedAt: address.updatedAt,
			});
		});

		it('should return an empty list when no addresses are found for the user', async () => {
			addressReader.findAll.mockResolvedValue({
				data: [],
				total: 0,
				page: 1,
				limit: 10,
			});

			const result = await useCase.execute({
				userId: 'user-id',
				query: {},
			});

			expect(addressReader.findAll).toHaveBeenCalledWith('user-id', {});
			expect(result.data).toEqual([]);
			expect(result.total).toBe(0);
		});
	});
});

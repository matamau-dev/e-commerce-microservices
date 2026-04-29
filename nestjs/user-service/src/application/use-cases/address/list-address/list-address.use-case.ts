import { AddressReader } from 'src/domain/repositories/address/address.repository';
import { ListAddressesInput } from './list-address.input';
import { ListAddressesOutput } from './list-address.output';

export class ListAddressesUseCase {
	constructor(private readonly addressReader: AddressReader) {}

	async execute(input: ListAddressesInput): Promise<ListAddressesOutput> {
		const result = await this.addressReader.findAll(
			input.userId,
			input.query,
		);

		return {
			...result,
			data: result.data.map((address) => ({
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
			})),
		};
	}
}

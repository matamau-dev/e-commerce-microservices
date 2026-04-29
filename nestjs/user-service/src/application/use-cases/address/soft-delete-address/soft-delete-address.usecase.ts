import { AddressNotFoundException } from 'src/domain/exceptions/address/address-not-found.exception';
import {
	AddressWriter,
	AddressReader,
} from '../../../../domain/repositories/address/address.repository';
import { DeleteAddressInput } from './soft-delete-address.input';
import { DeleteAddressOutput } from './soft-delete-address.output';
import { AddressNotOwnedByUserException } from 'src/domain/exceptions/address/address-not-owned-by-user.exception';
export class SoftDeleteAddressUseCase {
	constructor(
		private readonly addressWriter: AddressWriter,
		private readonly addressReader: AddressReader,
	) {}

	async execute(input: DeleteAddressInput): Promise<DeleteAddressOutput> {
		const address = await this.addressReader.findById(input.id);
		if (!address) throw new AddressNotFoundException();
		if (!address.belongsTo(input.userId))
			throw new AddressNotOwnedByUserException();
		await this.addressWriter.softDelete(input.id);
		return {
			message: 'Dirección eliminado',
		};
	}
}

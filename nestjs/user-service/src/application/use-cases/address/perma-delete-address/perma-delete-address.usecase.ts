import { AddressNotFoundException } from 'src/domain/exceptions/address/address-not-found.exception';
import {
	AddressReader,
	AddressWriter,
} from '../../../../domain/repositories/address/address.repository';
import { PermaDeleteAddressInput } from './perma-delete-address.input';
import { PermaDeleteAddressOutput } from './perma-delete-address.output';

export class PermaDeleteAddressUseCase {
	constructor(
		private readonly addressWriter: AddressWriter,
		private readonly addressReader: AddressReader,
	) {}

	async execute(
		input: PermaDeleteAddressInput,
	): Promise<PermaDeleteAddressOutput> {
		const address = await this.addressReader.findById(input.id);
		if (!address) throw new AddressNotFoundException();
		await this.addressWriter.permanentDelete(input.id);
		return { message: 'Dirección eliminada permanentemente' };
	}
}

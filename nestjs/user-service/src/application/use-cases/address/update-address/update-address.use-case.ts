import {
	AddressReader,
	AddressWriter,
} from 'src/domain/repositories/address/address.repository';
import { UpdateAddressInput } from './update-address.input';
import { UpdateAddressOutput } from './update-address.output';
import { AddressNotFoundException } from 'src/domain/exceptions/address/address-not-found.exception';
import { AddressNotOwnedByUserException } from 'src/domain/exceptions/address/address-not-owned-by-user.exception';
import { Location } from 'src/domain/entities/address/location.entity';

export class UpdateAddressUseCase {
	constructor(
		private readonly addressWriter: AddressWriter,
		private readonly addressReader: AddressReader,
	) {}

	async execute(input: UpdateAddressInput): Promise<UpdateAddressOutput> {
		const address = await this.addressReader.findById(input.id);
		if (!address) throw new AddressNotFoundException();

		if (!address.belongsTo(input.userId)) {
			throw new AddressNotOwnedByUserException();
		}
		address.applyUpdate({
			fullName: input.fullName,
			phone: input.phone,
			references: input.references,
		});
		if (input.location !== undefined) {
			const location = Location.create(input.location);
			address.updateLocation(location);
		}

		if (input.isDefault !== undefined && input.isDefault) {
			await this.addressWriter.clearDefaultByUserId(input.userId);
			address.setAsDefault();
		}

		await this.addressWriter.update(address);

		return {
			id: address.id,
			fullName: address.fullName,
			phone: address.phone.getValue(),
			isDefault: address.isDefault,
			userId: address.userId,
			location: {
				street: address.location.street,
				externalNumber: address.location.externalNumber,
				neighborhood: address.location.neighborhood,
				city: address.location.city,
				state: address.location.state,
				postalCode: address.location.postalCode.getValue(),
				internalNumber: address.location.internalNumber,
			},
			createdAt: address.createdAt,
			references: address.references,
			updatedAt: address.updatedAt,
		};
	}
}

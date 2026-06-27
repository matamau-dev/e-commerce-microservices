import {
	AddressReader,
	AddressWriter,
} from 'src/domain/repositories/address/address.repository';
import { NewAddressInput } from './new-address.input';
import { NewAddressOutput } from './new-address.output';
import { PhoneNumber } from 'src/domain/value-objects/utils/phone.value-object';
import { PostalCode } from 'src/domain/value-objects/address/postal-code.value-object';
import { Address } from 'src/domain/entities/address/address.entity';
import { UserReader } from 'src/domain/repositories/user/user.repository';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';
import { Location } from 'src/domain/entities/address/location.entity';

export class NewAddressUseCase {
	constructor(
		private readonly addressWriter: AddressWriter,
		private readonly addressReader: AddressReader,
		private readonly userReader: UserReader,
	) {}

	async execute(input: NewAddressInput): Promise<NewAddressOutput> {
		const user = await this.userReader.findById(input.userId);
		if (!user) throw new UserNotFoundException(input.userId);

		if (input.isDefault) {
			const current = await this.addressReader.findDefaultByUserId(
				input.userId,
			);

			if (current) {
				current.isDefault = false;
				current.updatedAt = new Date();
				await this.addressWriter.update(current);
			}
		}
		const location = Location.create(input.location);

		const address = Address.create({
			fullName: user.name,
			phone: input.phone,
			location,
			isDefault: input.isDefault,
			userId: input.userId,
			references: input.references,
		});

		await this.addressWriter.create(address);

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

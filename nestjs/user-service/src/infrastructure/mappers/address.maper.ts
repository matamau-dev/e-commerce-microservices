import { Address } from 'src/domain/entities/address/address.entity';
import { AddressOrmEntity } from '../database/postgres/orm-entities/address.orm-entity';
import { Location } from 'src/domain/entities/address/location.entity';

export class AddressMapper {
	private constructor() {}

	static AddressORMtoAddressDomain(orm: AddressOrmEntity): Address {
		return Address.fromPersistence({
			id: orm.id,
			fullName: orm.fullName,
			phone: orm.phone,
			location: Location.create({
				street: orm.street,
				externalNumber: orm.externalNumber,
				neighborhood: orm.neighborhood,
				city: orm.city,
				state: orm.state,
				postalCode: orm.postalCode,
				internalNumber: orm.internalNumber,
			}),
			isDefault: orm.isDefault,
			userId: orm.userId,
			createdAt: orm.createdAt,
			references: orm.referenceNotes,
			updatedAt: orm.updatedAt,
		});
	}

	static AddressDomainToAddressORM(address: Address) {
		return {
			id: address.id,
			fullName: address.fullName,
			phone: address.phone.getValue(),
			street: address.location.street,
			externalNumber: address.location.externalNumber,
			neighborhood: address.location.neighborhood,
			city: address.location.city,
			state: address.location.state,
			postalCode: address.location.postalCode.getValue(),
			isDefault: address.isDefault,
			userId: address.userId,
			createdAt: address.createdAt,
			internalNumber: address.location.internalNumber,
			referenceNotes: address.references,
			updatedAt: address.updatedAt,
		};
	}
}

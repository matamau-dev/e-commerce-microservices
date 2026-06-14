import { Address } from './address.entity';
import { makeAddress } from 'test/factory/address.factory';
import { makeLocation } from 'test/factory/location.factory';

describe('Address Entity', () => {
	describe('creation', () => {
		it('should correctly create an Address instance with default fields and generated ID', () => {
			const address = makeAddress();

			expect(address).toBeDefined();
			expect(address.id).toBeDefined();
			expect(address.fullName).toBe('Juan Pérez');
			expect(address.phone.getValue()).toBe('9611234567');
			expect(address.location.city).toBe('Tuxtla');
			expect(address.isDefault).toBe(false);
			expect(address.userId).toBe('user-id');
			expect(address.createdAt).toBeInstanceOf(Date);
		});

		it('should correctly restore an Address instance from persistence data', () => {
			const createdAt = new Date();
			const address = Address.fromPersistence({
				id: 'address-id',
				fullName: 'Mauricio',
				phone: '9611234567',
				location: makeLocation(),
				isDefault: true,
				userId: 'user-id',
				createdAt,
				references: 'Casa azul',
			});

			expect(address.id).toBe('address-id');
			expect(address.fullName).toBe('Mauricio');
			expect(address.phone.getValue()).toBe('9611234567');
			expect(address.isDefault).toBe(true);
			expect(address.createdAt).toBe(createdAt);
		});
	});

	describe('belongsTo', () => {
		it('should return true if the address belongs to the specified user', () => {
			const address = makeAddress();

			expect(address.belongsTo('user-id')).toBe(true);
		});

		it('should return false if the address does not belong to the specified user', () => {
			const address = makeAddress();

			expect(address.belongsTo('otro-user')).toBe(false);
		});
	});

	describe('updates', () => {
		describe('updateFullName', () => {
			it('should update the full name and set updatedAt to the current date', () => {
				const address = makeAddress();
				address.updateFullName('Nuevo Nombre');

				expect(address.fullName).toBe('Nuevo Nombre');
				expect(address.updatedAt).toBeInstanceOf(Date);
			});

			it('should not update or change updatedAt if the new full name is the same', () => {
				const address = makeAddress();
				const updatedAtBefore = address.updatedAt;

				address.updateFullName(address.fullName);

				expect(address.updatedAt).toBe(updatedAtBefore);
			});
		});

		describe('updatePhone', () => {
			it('should update the phone number and set updatedAt to the current date', () => {
				const address = makeAddress();
				address.updatePhone('9619999999');

				expect(address.phone.getValue()).toBe('9619999999');
				expect(address.updatedAt).toBeInstanceOf(Date);
			});

			it('should not update or change updatedAt if the new phone is equivalent', () => {
				const address = makeAddress();
				const updatedAtBefore = address.updatedAt;

				address.updatePhone(address.phone.getValue());

				expect(address.updatedAt).toBe(updatedAtBefore);
			});

			it('should throw an error if the new phone is invalid', () => {
				const address = makeAddress();

				expect(() => address.updatePhone('invalid-phone')).toThrow();
			});
		});

		describe('updateReferences', () => {
			it('should update the references field and set updatedAt to the current date', () => {
				const address = makeAddress();
				address.updateReferences('Frente al parque');

				expect(address.references).toBe('Frente al parque');
				expect(address.updatedAt).toBeInstanceOf(Date);
			});

			it('should not update or change updatedAt if the new reference value is the same', () => {
				const address = makeAddress();
				const updatedAtBefore = address.updatedAt;

				address.updateReferences(address.references);

				expect(address.updatedAt).toBe(updatedAtBefore);
			});
		});

		describe('updateLocation', () => {
			it('should update the location and set updatedAt to the current date', () => {
				const address = makeAddress();
				const newLocation = makeLocation({ city: 'San Cristóbal' });

				address.updateLocation(newLocation);

				expect(address.location.city).toBe('San Cristóbal');
				expect(address.updatedAt).toBeInstanceOf(Date);
			});
		});

		describe('applyUpdate', () => {
			it('should apply partial updates and set updatedAt to the current date', () => {
				const address = makeAddress();
				address.applyUpdate({
					fullName: 'Nuevo Nombre',
					phone: '9618888888',
					references: 'Nueva referencia',
				});

				expect(address.fullName).toBe('Nuevo Nombre');
				expect(address.phone.getValue()).toBe('9618888888');
				expect(address.references).toBe('Nueva referencia');
				expect(address.updatedAt).toBeInstanceOf(Date);
			});

			it('should not touch or change updatedAt if empty updates are applied', () => {
				const address = makeAddress();
				const updatedAtBefore = address.updatedAt;

				address.applyUpdate({});

				expect(address.updatedAt).toBe(updatedAtBefore);
			});
		});
	});

	describe('default state management', () => {
		describe('setAsDefault', () => {
			it('should mark the address as default and set updatedAt to the current date', () => {
				const address = makeAddress({ isDefault: false });
				address.setAsDefault();

				expect(address.isDefault).toBe(true);
				expect(address.updatedAt).toBeInstanceOf(Date);
			});

			it('should do nothing and not modify updatedAt if the address is already default', () => {
				const address = makeAddress({ isDefault: true });
				address.setAsDefault();
				const updatedAtBefore = address.updatedAt;

				address.setAsDefault();

				expect(address.updatedAt).toBe(updatedAtBefore);
			});
		});

		describe('setAsNotDefault', () => {
			it('should mark the address as not default and set updatedAt to the current date', () => {
				const address = Address.fromPersistence({
					id: 'address-id',
					fullName: 'Mauricio',
					phone: '9611234567',
					location: makeLocation(),
					isDefault: true,
					userId: 'user-id',
					createdAt: new Date(),
				});

				address.setAsNotDefault();

				expect(address.isDefault).toBe(false);
				expect(address.updatedAt).toBeInstanceOf(Date);
			});

			it('should do nothing and not modify updatedAt if the address is already not default', () => {
				const address = makeAddress({ isDefault: false });
				const updatedAtBefore = address.updatedAt;

				address.setAsNotDefault();

				expect(address.updatedAt).toBe(updatedAtBefore);
			});
		});
	});
});

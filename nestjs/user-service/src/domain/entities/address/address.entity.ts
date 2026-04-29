import { PhoneNumber } from 'src/domain/value-objects/utils/phone.value-object';
import { Location } from './location.entity';

export class Address {
	private constructor(
		public readonly id: string,
		public fullName: string,
		public phone: PhoneNumber,
		public location: Location,
		public isDefault: boolean,
		public userId: string,
		public readonly createdAt: Date,
		public references?: string,
		public updatedAt?: Date,
	) {}

	static create(input: {
		fullName: string;
		phone: string;
		location: Location;
		isDefault: boolean;
		userId: string;
		references?: string;
	}): Address {
		return new Address(
			crypto.randomUUID(),
			input.fullName,
			PhoneNumber.create(input.phone),
			input.location,
			input.isDefault,
			input.userId,
			new Date(),
			input.references,
		);
	}

	static fromPersistence(input: {
		id: string;
		fullName: string;
		phone: string;
		location: Location;
		isDefault: boolean;
		userId: string;
		createdAt: Date;
		references?: string;
		updatedAt?: Date;
	}): Address {
		return new Address(
			input.id,
			input.fullName,
			PhoneNumber.create(input.phone),
			input.location,
			input.isDefault,
			input.userId,
			input.createdAt,
			input.references,
			input.updatedAt,
		);
	}

	applyUpdate(input: {
		fullName?: string;
		phone?: string;
		references?: string;
	}) {
		if (input.fullName !== undefined) {
			this.updateFullName(input.fullName);
		}

		if (input.phone !== undefined) {
			this.updatePhone(input.phone);
		}

		if (input.references !== undefined) {
			this.updateReferences(input.references);
		}
	}

	belongsTo(userId: string): boolean {
		return this.userId === userId;
	}
	updateFullName(fullName: string) {
		if (this.fullName === fullName) return;

		this.fullName = fullName;
		this.touch();
	}

	updatePhone(phone: string) {
		const newPhone = PhoneNumber.create(phone);

		if (this.phone.equals(newPhone)) return;

		this.phone = newPhone;
		this.touch();
	}

	updateReferences(references?: string) {
		if (this.references === references) return;

		this.references = references;
		this.touch();
	}

	updateLocation(location: Location) {
		this.location = location;
		this.touch();
	}

	setAsDefault() {
		if (this.isDefault) return;

		this.isDefault = true;
		this.touch();
	}

	setAsNotDefault() {
		if (!this.isDefault) return;

		this.isDefault = false;
		this.touch();
	}

	private touch() {
		this.updatedAt = new Date();
	}
}

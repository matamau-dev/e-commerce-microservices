import { RoleEnum } from 'src/domain/enums/role.enum';
import { ProfileImage } from '../image_user/profile-image.entity';
import { Address } from '../address/address.entity';
import { PhoneNumber } from 'src/domain/value-objects/utils/phone.value-object';
import { Email } from 'src/domain/value-objects/user/email.value-object';
import { SamePhoneException } from 'src/domain/exceptions/user/same-phone.exception';

export class User {
	private constructor(
		public readonly id: string,
		private _name: string,
		public readonly email: Email,
		private _phone: PhoneNumber,
		private _password: string,
		public readonly role: RoleEnum,
		private _isActive: boolean,
		public readonly createdAt: Date,
		public readonly addresses: Address[],
		public readonly profileImages?: ProfileImage,
		private _updatedAt?: Date,
		private _deletedAt?: Date,
	) {}

	static create(input: {
		name: string;
		email: Email;
		phone: PhoneNumber;
		password: string;
		role: RoleEnum;
		isActive?: boolean;
		addresses?: Address[];
		profileImages?: ProfileImage;
	}): User {
		return new User(
			crypto.randomUUID(),
			input.name.trim(),
			input.email,
			input.phone,
			input.password,
			input.role,
			input.isActive ?? true,
			new Date(),
			input.addresses ?? [],
			input.profileImages,
		);
	}

	static fromPersistence(input: {
		id: string;
		name: string;
		email: string;
		phone: string;
		password: string;
		role: RoleEnum;
		isActive: boolean;
		createdAt: Date;
		addresses?: Address[];
		profileImages?: ProfileImage;
		updatedAt?: Date;
	}): User {
		return new User(
			input.id,
			input.name,
			Email.create(input.email),
			PhoneNumber.create(input.phone),
			input.password,
			input.role,
			input.isActive,
			input.createdAt,
			input.addresses ?? [],
			input.profileImages,
			input.updatedAt,
		);
	}

	get name(): string {
		return this._name;
	}

	get phone(): PhoneNumber {
		return this._phone;
	}

	get password(): string {
		return this._password;
	}

	get isActive(): boolean {
		return this._isActive;
	}

	get updatedAt(): Date | undefined {
		return this._updatedAt;
	}

	get deletedAt(): Date | undefined {
		return this._deletedAt;
	}

	changeName(name: string): void {
		const normalized = name.trim();

		if (!normalized) {
			throw new Error('Name is required');
		}

		this._name = normalized;
		this.touch();
	}

	changePhone(phone: PhoneNumber): void {
		if (this._phone === phone) {
			throw new SamePhoneException();
		}

		this._phone = phone;
		this.touch();
	}

	changePassword(hash: string): void {
		this._password = hash;
		this.touch();
	}

	softDelete(): void {
		this._deletedAt = new Date();
		this.touch();
	}

	activate(): void {
		this._isActive = true;
		this.touch();
	}

	deactivate(): void {
		this._isActive = false;
		this.touch();
	}

	private touch(): void {
		this._updatedAt = new Date();
	}
}

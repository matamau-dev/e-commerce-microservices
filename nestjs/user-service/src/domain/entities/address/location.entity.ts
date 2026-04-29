import { PostalCode } from 'src/domain/value-objects/address/postal-code.value-object';

export class Location {
	private constructor(
		public readonly street: string,
		public readonly externalNumber: string,
		public readonly neighborhood: string,
		public readonly city: string,
		public readonly state: string,
		public readonly postalCode: PostalCode,
		public readonly internalNumber?: string,
	) {}

	static create(input: {
		street: string;
		externalNumber: string;
		neighborhood: string;
		city: string;
		state: string;
		postalCode: string;
		internalNumber?: string;
	}): Location {
		return new Location(
			input.street,
			input.externalNumber,
			input.neighborhood,
			input.city,
			input.state,
			PostalCode.create(input.postalCode),
			input.internalNumber,
		);
	}
}

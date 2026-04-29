export interface NewAddressOutput {
	id: string;
	fullName: string;
	phone: string;
	isDefault: boolean;
	location: LocationOutput;
	userId: string;
	createdAt: Date;
	references?: string;
	updatedAt?: Date;
}

interface LocationOutput {
	street: string;
	externalNumber: string;
	neighborhood: string;
	city: string;
	state: string;
	postalCode: string;
	internalNumber?: string;
}

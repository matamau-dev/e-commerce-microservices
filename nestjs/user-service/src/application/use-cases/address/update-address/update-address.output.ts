import { LocationOutput } from '../utils/location.output';

export interface UpdateAddressOutput {
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

import { LocationInput } from '../utils/location.input';

export interface NewAddressInput {
	fullName: string;
	phone: string;
	isDefault: boolean;
	location: LocationInput;
	userId: string;
	references?: string;
}

import { LocationInput } from '../utils/location.input';

export interface UpdateAddressInput {
	id: string;
	userId: string;
	fullName?: string;
	phone?: string;
	isDefault?: boolean;
	location?: LocationInput;
	references?: string;
}

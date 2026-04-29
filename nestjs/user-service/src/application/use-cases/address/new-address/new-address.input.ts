import { LocationInput } from '../utils/location.input';

export interface NewAddressInput {
	fullName: string;
	phone: string;
	isDefault: boolean;
	location: LocationInput;
	userId: string;
	isMine: boolean;
	references?: string;
}

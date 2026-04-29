import { CursorResult } from 'src/domain/pagination/cursor-result.interface';
import { LocationOutput } from '../utils/location.output';

export interface AddressItem {
	id: string;
	fullName: string;
	phone: string;
	location: LocationOutput;
	isDefault: boolean;
	createAt: Date;
	references?: string;
	updatedAt?: Date;
}

export type ListAddressesOutput = CursorResult<AddressItem>;

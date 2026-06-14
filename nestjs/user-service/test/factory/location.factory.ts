import { Location } from 'src/domain/entities/address/location.entity';

export const makeLocation = (
	overrides?: Partial<{
		street: string;
		externalNumber: string;
		neighborhood: string;
		city: string;
		state: string;
		postalCode: string;
		internalNumber?: string;
	}>,
): Location =>
	Location.create({
		street: overrides?.street ?? 'Av. Central',
		externalNumber: overrides?.externalNumber ?? '123',
		neighborhood: overrides?.neighborhood ?? 'Centro',
		city: overrides?.city ?? 'Tuxtla',
		state: overrides?.state ?? 'Chiapas',
		postalCode: overrides?.postalCode ?? '29000',
		internalNumber: overrides?.internalNumber,
	});

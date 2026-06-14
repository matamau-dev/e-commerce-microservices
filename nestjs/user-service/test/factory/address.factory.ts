import { Address } from 'src/domain/entities/address/address.entity';
import { makeLocation } from './location.factory';

export const makeAddress = (
	overrides?: Partial<{
		fullName: string;
		phone: string;
		location: ReturnType<typeof makeLocation>;
		isDefault: boolean;
		userId: string;
		references?: string;
	}>,
): Address =>
	Address.create({
		fullName: overrides?.fullName ?? 'Juan Pérez',
		phone: overrides?.phone ?? '9611234567',
		location: overrides?.location ?? makeLocation(),
		isDefault: overrides?.isDefault ?? false,
		userId: overrides?.userId ?? 'user-id',
		references: overrides?.references,
	});

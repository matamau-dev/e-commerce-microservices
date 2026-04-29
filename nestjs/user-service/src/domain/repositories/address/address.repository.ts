import { Address } from 'src/domain/entities/address/address.entity';
import { CursorQuery } from 'src/domain/pagination/cursor-query.interface';
import { CursorResult } from 'src/domain/pagination/cursor-result.interface';

export interface AddressReader {
	findAll(userId: string, query: CursorQuery): Promise<CursorResult<Address>>;
	findById(id: string): Promise<Address | null>;
	findByUserId(userId: string): Promise<Address[]>;
	findDefaultByUserId(userId: string): Promise<Address | null>;
}

export interface AddressWriter {
	create(address: Address): Promise<Address>;
	update(address: Address): Promise<Address | null>;
	softDelete(id: string): Promise<string>;
	permanentDelete(id: string): Promise<string>;
	clearDefaultByUserId(userId: string): Promise<void>;
}

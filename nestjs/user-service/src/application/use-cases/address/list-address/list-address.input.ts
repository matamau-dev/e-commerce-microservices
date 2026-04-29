import { CursorQuery } from 'src/domain/pagination/cursor-query.interface';

export interface ListAddressesInput {
	userId: string;
	query: CursorQuery;
}

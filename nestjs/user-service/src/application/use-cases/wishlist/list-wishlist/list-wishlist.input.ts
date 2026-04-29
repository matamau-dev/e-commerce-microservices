import { CursorQuery } from 'src/domain/pagination/cursor-query.interface';

export interface ListWishInput {
	userId: string;
	query: CursorQuery;
}

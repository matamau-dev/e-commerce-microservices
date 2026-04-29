import { CursorQuery } from './cursor-query.interface';
import { CursorResult } from './cursor-result.interface';

export interface CursorPagination {
	paginate<T>(options: PaginationOptions<T>): Promise<CursorResult<T>>;
}

export interface PaginationOptions<T> {
	items: T[];
	query: CursorQuery;
	cursorField: keyof T;
}

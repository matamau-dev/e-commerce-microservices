export interface CursorResult<T> {
	data: T[];
	nextCursor: string | null;
	prevCursor: string | null;
	hasMore: boolean;
}

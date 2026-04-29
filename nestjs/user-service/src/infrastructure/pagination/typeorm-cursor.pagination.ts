import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { CursorQuery } from 'src/domain/pagination/cursor-query.interface';
import { CursorResult } from 'src/domain/pagination/cursor-result.interface';
import { decodeCursor, encodeCursor } from './cursor.helpers';

export class TypeormCursorPagination {
	private readonly defaultLimit = 10;
	private readonly maxLimit = 50;

	private getParams(query: CursorQuery) {
		const limit = Math.min(query.limit ?? this.defaultLimit, this.maxLimit);

		const isBackward = Boolean(query.prevCursor);

		return {
			limit,
			cursor: isBackward ? query.prevCursor : query.nextCursor,
			operator: isBackward ? '<' : '>',
			order: isBackward ? 'DESC' : 'ASC',
		};
	}

	private getCursors<T>(
		query: CursorQuery,
		results: T[],
		limit: number,
		order: string,
		cursorField: string,
	) {
		const hasMore = results.length > limit;
		if (hasMore) results.pop();

		let nextCursorDate: Date | null = null;
		let prevCursorDate: Date | null = null;

		if (order === 'ASC' && hasMore) {
			nextCursorDate = (results[results.length - 1] as any)[cursorField];
		}

		if (order === 'ASC' && query.nextCursor) {
			prevCursorDate = (results[0] as any)[cursorField];
		}

		if (order === 'DESC' && hasMore) {
			prevCursorDate = (results[results.length - 1] as any)[cursorField];
		}

		if (order === 'DESC' && query.prevCursor) {
			nextCursorDate = (results[0] as any)[cursorField];
		}

		return { nextCursorDate, prevCursorDate, hasMore };
	}

	async paginate<T extends ObjectLiteral>(
		qb: SelectQueryBuilder<T>,
		query: CursorQuery,
		alias: string,
		cursorField: string = 'createdAt',
	): Promise<CursorResult<T>> {
		const { limit, cursor, operator, order } = this.getParams(query);

		// Decodifica el cursor si existe
		if (cursor) {
			const cursorDate = decodeCursor(cursor);
			qb.andWhere(`${alias}.${cursorField} ${operator} :cursor`, {
				cursor: cursorDate,
			});
		}

		qb.orderBy(`${alias}.${cursorField}`, order as 'ASC' | 'DESC').take(
			limit + 1,
		);

		const results = await qb.getMany();

		const { nextCursorDate, prevCursorDate, hasMore } = this.getCursors(
			query,
			results,
			limit,
			order,
			cursorField,
		);

		// Igual que el tutorial — revertir si es DESC
		if (order === 'DESC') results.reverse();

		return {
			data: results,
			hasMore,
			nextCursor: nextCursorDate ? encodeCursor(nextCursorDate) : null,
			prevCursor: prevCursorDate ? encodeCursor(prevCursorDate) : null,
		};
	}
}

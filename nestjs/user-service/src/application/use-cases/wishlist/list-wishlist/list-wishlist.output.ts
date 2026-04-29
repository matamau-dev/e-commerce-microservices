import { CursorResult } from 'src/domain/pagination/cursor-result.interface';

export interface ListWishOutput {
	id: string;
	name?: string;
	isPrivate: boolean;
	isDefault: boolean;
	itemsCount: number;
	sharesCount: number;
	createdAt: Date;
	updatedAt?: Date;
}

export type ListWishOutPut = CursorResult<ListWishOutput>;

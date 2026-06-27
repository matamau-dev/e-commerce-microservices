import { CursorResult } from 'src/domain/pagination/cursor-result.interface';

export interface ListProductLineITem {
	id: string;
	name: string;
	slug: string;
	createdAt: Date;
	updatedAt: Date;
}

export type ListProductLineOutput = CursorResult<ListProductLineITem>;

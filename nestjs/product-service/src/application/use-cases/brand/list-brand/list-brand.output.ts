import { CursorResult } from 'src/domain/pagination/cursor-result.interface';

export interface BrandItem {
	id: string;
	name: string;
	slug: string;
	createdAt: Date;
	updatedAt: Date;
}

export type ListBrandOutput = CursorResult<BrandItem>;

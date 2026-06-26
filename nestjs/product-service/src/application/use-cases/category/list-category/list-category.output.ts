import { CursorResult } from 'src/domain/pagination/cursor-result.interface';

export interface CategoryItem {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	parentID?: string;
	slug?: string;
}

export type ListCategoryOutput = CursorResult<CategoryItem>;

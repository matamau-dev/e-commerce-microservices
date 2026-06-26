import { Category } from 'src/domain/entities/category/category.entity';
import { CursorQuery } from 'src/domain/pagination/cursor-query.interface';
import { CursorResult } from 'src/domain/pagination/cursor-result.interface';

export interface CategoryReader {
	findAll(query: CursorQuery): Promise<CursorResult<Category>>;

	findAllForTree(): Promise<Category[]>;

	findByID(id: string): Promise<Category | null>;
	findByIdWithDeleted(id: string): Promise<Category | null>;

	existBySlug(slug: string): Promise<boolean>;
	existsBySlugExcludingId(slug: string, categoryID: string): Promise<boolean>;
	hasActiveChildren(parentID: string): Promise<boolean>;
}

export interface CategoryWriter {
	create(category: Category): Promise<Category>;
	update(category: Category): Promise<Category | null>;
	softDelete(id: string): Promise<void>;
}

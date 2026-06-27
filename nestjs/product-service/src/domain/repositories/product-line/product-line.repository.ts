import { ProductLine } from 'src/domain/entities/product-line/product-line.entity';
import { CursorQuery } from 'src/domain/pagination/cursor-query.interface';
import { CursorResult } from 'src/domain/pagination/cursor-result.interface';

export interface ProductLineReader {
	findAll(query: CursorQuery): Promise<CursorResult<ProductLine>>;
	findByID(id: string): Promise<ProductLine | null>;

	existsBySlugExcludingId(slug: string, id: string): Promise<boolean>;
	existsBySlug(slug: string);
}
export interface ProductLineWriter {
	create(productLine: ProductLine): Promise<ProductLine>;
	update(productLine: ProductLine): Promise<ProductLine>;
	softDelete(id: string): Promise<void>;
}

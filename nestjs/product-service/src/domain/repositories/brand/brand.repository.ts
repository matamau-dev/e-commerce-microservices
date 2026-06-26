import { Brand } from 'src/domain/entities/brand/brand.entity';
import { CursorQuery } from 'src/domain/pagination/cursor-query.interface';
import { CursorResult } from 'src/domain/pagination/cursor-result.interface';

export interface BrandReader {
	findAll(query: CursorQuery): Promise<CursorResult<Brand>>;
	findByID(id: string): Promise<Brand | null>;
	findBySlug(slug: string): Promise<Brand | null>;

	existBySlug(slug: string): Promise<boolean>;
}

export interface BrandWriter {
	create(brand: Brand): Promise<Brand>;
	update(drand: Brand): Promise<Brand>;
	softDelete(id: string): Promise<void>;
}

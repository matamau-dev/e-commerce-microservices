import {
	ProductLineReader,
	ProductLineWriter,
} from 'src/domain/repositories/product-line/product-line.repository';
import { ProductLineOrmEntity } from '../orm-entities/product-line.orm-entity';
import { Repository, Not, IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductLine } from 'src/domain/entities/product-line/product-line.entity';
import { CursorQuery } from 'src/domain/pagination/cursor-query.interface';
import { CursorResult } from 'src/domain/pagination/cursor-result.interface';
import { ProductLineMapper } from 'src/infrastructure/mappers/product-line.mapper';
import { TypeormCursorPagination } from 'src/infrastructure/pagination/typeorm-cursor.pagination';

export class ProductLinePgRepository
	implements ProductLineWriter, ProductLineReader
{
	constructor(
		@InjectRepository(ProductLineOrmEntity)
		private readonly productLineRepository: Repository<ProductLineOrmEntity>,
		private readonly pagination: TypeormCursorPagination,
	) {}

	async findAll(query: CursorQuery): Promise<CursorResult<ProductLine>> {
		const qb = await this.productLineRepository
			.createQueryBuilder('product_lines')
			.where('product_lines.deleted_at IS NULL');

		const result = await this.pagination.paginate(
			qb,
			query,
			'product_lines',
			'created_at',
		);

		return {
			...result,
			data: result.data.map((productLine) =>
				ProductLineMapper.ProductLineOrmToProductLineDomain(
					productLine,
				),
			),
		};
	}

	async findByID(id: string): Promise<ProductLine | null> {
		const productLine = await this.productLineRepository.findOneBy({ id });
		return productLine
			? ProductLineMapper.ProductLineOrmToProductLineDomain(productLine)
			: null;
	}

	async existsBySlugExcludingId(slug: string, id: string): Promise<boolean> {
		return this.productLineRepository.exists({
			where: { slug, id: Not(id) },
		});
	}

	async existsBySlug(slug: string) {
		return this.productLineRepository.exists({ where: { slug } });
	}

	async create(productLine: ProductLine): Promise<ProductLine> {
		const save = await this.productLineRepository.save(
			ProductLineMapper.ProductLineDomainToProductLineOrm(productLine),
		);
		return ProductLineMapper.ProductLineOrmToProductLineDomain(save);
	}

	async update(productLine: ProductLine): Promise<ProductLine> {
		const update = await this.productLineRepository.save(
			ProductLineMapper.ProductLineDomainToProductLineOrm(productLine),
		);
		return ProductLineMapper.ProductLineOrmToProductLineDomain(update);
	}

	async softDelete(id: string): Promise<void> {
		await this.productLineRepository.softDelete(id);
	}
}

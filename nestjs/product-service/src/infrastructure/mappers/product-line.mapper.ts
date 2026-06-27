import { ProductLine } from 'src/domain/entities/product-line/product-line.entity';
import { ProductLineOrmEntity } from '../database/postgres/orm-entities/product-line.orm-entity';

export class ProductLineMapper {
	private constructor() {}

	static ProductLineOrmToProductLineDomain(
		orm: ProductLineOrmEntity,
	): ProductLine {
		return ProductLine.fromPersistence({
			id: orm.id,
			name: orm.productLine,
			slug: orm.slug,
			createdAt: orm.created_at,
			updatedAt: orm.updated_at,
		});
	}

	static ProductLineDomainToProductLineOrm(
		productLine: ProductLine,
	): ProductLineOrmEntity {
		return {
			id: productLine.id,
			productLine: productLine.name,
			slug: productLine.slug!,
			created_at: productLine.createdAt,
			updated_at: productLine.updatedAt,
		};
	}
}

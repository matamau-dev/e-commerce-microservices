import { Brand } from 'src/domain/entities/brand/brand.entity';
import { BrandOrmEntity } from '../database/postgres/orm-entities/brand.orm-entity';

export class BrandMapper {
	private constructor() {}

	static BrandOrmToBrandDomain(orm: BrandOrmEntity): Brand {
		return Brand.fromPersistence({
			id: orm.id,
			name: orm.brand,
			slug: orm.slug,
			createdAt: orm.created_at,
			updatedAt: orm.updated_at,
		});
	}

	static BrandDomainToBrandOrm(brand: Brand): BrandOrmEntity {
		return {
			id: brand.id,
			brand: brand.name,
			slug: brand.slug,
			created_at: brand.createdAt,
			updated_at: brand.updatedAt,
		};
	}
}

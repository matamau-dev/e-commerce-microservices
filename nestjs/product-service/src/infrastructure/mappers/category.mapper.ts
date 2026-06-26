import { Category } from 'src/domain/entities/category/category.entity';
import { CategoryOrmEntity } from '../database/postgres/orm-entities/category.orm-entity';

export class CategoryMapper {
	private constructor() {}

	static CategoryOrmToCategoryDomain(orm: CategoryOrmEntity): Category {
		return Category.fromPersistence({
			id: orm.id,
			name: orm.category,
			slug: orm.slug,
			parentID: orm.parentId,
			createdAt: orm.created_at,
			updatedAt: orm.updated_at,
		});
	}

	static CategoryDomainToCategoryOrm(category: Category): CategoryOrmEntity {
		return {
			id: category.id,
			category: category.name,
			slug: category.slug,
			parentId: category.parentID,
			created_at: category.createdAt,
			updated_at: category.updatedAt,
		} as CategoryOrmEntity;
	}
}

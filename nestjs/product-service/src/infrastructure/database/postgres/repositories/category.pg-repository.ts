import {
	CategoryReader,
	CategoryWriter,
} from 'src/domain/repositories/category/category.repository';
import { CategoryOrmEntity } from '../orm-entities/category.orm-entity';
import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/domain/entities/category/category.entity';
import { CursorQuery } from 'src/domain/pagination/cursor-query.interface';
import { CursorResult } from 'src/domain/pagination/cursor-result.interface';
import { TypeormCursorPagination } from 'src/infrastructure/pagination/typeorm-cursor.pagination';
import { CategoryMapper } from 'src/infrastructure/mappers/category.mapper';

export class CategoryPgRepository implements CategoryReader, CategoryWriter {
	constructor(
		@InjectRepository(CategoryOrmEntity)
		private readonly categoryRepository: Repository<CategoryOrmEntity>,
		private readonly pagination: TypeormCursorPagination,
	) {}

	async findAll(query: CursorQuery): Promise<CursorResult<Category>> {
		const qb = await this.categoryRepository
			.createQueryBuilder('categories')
			.where('categories.deleted_at IS NULL');

		const result = await this.pagination.paginate(
			qb,
			query,
			'categories',
			'created_at',
		);
		return {
			...result,
			data: result.data.map((category) =>
				CategoryMapper.CategoryOrmToCategoryDomain(category),
			),
		};
	}

	async findAllForTree(): Promise<Category[]> {
		const categories = await this.categoryRepository.find();
		return categories.map((category) =>
			CategoryMapper.CategoryOrmToCategoryDomain(category),
		);
	}

	async findByID(id: string): Promise<Category | null> {
		const category = await this.categoryRepository.findOne({
			where: { id },
		});
		return category
			? CategoryMapper.CategoryOrmToCategoryDomain(category)
			: null;
	}

	async findAllHasDeleted(
		query: CursorQuery,
	): Promise<CursorResult<Category>> {
		const qb = this.categoryRepository
			.createQueryBuilder('categories')
			.withDeleted()
			.where('categories.deleted_at IS NOT NULL');

		const result = await this.pagination.paginate(
			qb,
			query,
			'categories',
			'created_at',
		);
		return {
			...result,
			data: result.data.map((category) =>
				CategoryMapper.CategoryOrmToCategoryDomain(category),
			),
		};
	}

	async findByIdWithDeleted(id: string): Promise<Category | null> {
		const category = await this.categoryRepository.findOne({
			where: { id },
			withDeleted: true,
		});
		return category
			? CategoryMapper.CategoryOrmToCategoryDomain(category)
			: null;
	}

	async existBySlug(slug: string): Promise<boolean> {
		return await this.categoryRepository.exists({ where: { slug } });
	}

	async existsBySlugExcludingId(
		slug: string,
		categoryID: string,
	): Promise<boolean> {
		return this.categoryRepository.exists({
			where: {
				slug,
				id: Not(categoryID),
			},
		});
	}

	async hasActiveChildren(parentID: string): Promise<boolean> {
		return await this.categoryRepository.exists({
			where: { parentId: parentID, deleted_at: IsNull() },
		});
	}

	async create(category: Category): Promise<Category> {
		const save = await this.categoryRepository.save(
			CategoryMapper.CategoryDomainToCategoryOrm(category),
		);
		return CategoryMapper.CategoryOrmToCategoryDomain(save);
	}

	async update(category: Category): Promise<Category | null> {
		const updated = await this.categoryRepository.save(
			CategoryMapper.CategoryDomainToCategoryOrm(category),
		);
		return updated
			? CategoryMapper.CategoryOrmToCategoryDomain(updated)
			: null;
	}

	async softDelete(id: string): Promise<void> {
		await this.categoryRepository.softDelete(id);
	}
}

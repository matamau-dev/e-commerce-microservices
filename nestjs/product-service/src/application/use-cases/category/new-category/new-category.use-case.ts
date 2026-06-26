import { CategoryReader } from 'src/domain/repositories/category/category.repository';
import { NewCategoryInput } from './new-category.input';
import { NewCategoryOutput } from './new-category.output';
import { CategoryNotFoundException } from 'src/domain/exceptions/category/category-not-found.exception';
import { Slugify } from 'src/shared/utils/slugify.util';
import { Category } from 'src/domain/entities/category/category.entity';
import { CategoryWriter } from '../../../../domain/repositories/category/category.repository';
import { CategoryAlreadyExistsException } from 'src/domain/exceptions/category/category-already-exists.exception';

export class CreateCategoryUseCase {
	constructor(
		private readonly categoryReader: CategoryReader,
		private readonly categoryWriter: CategoryWriter,
	) {}

	async execute(input: NewCategoryInput): Promise<NewCategoryOutput> {
		const { name, parentID, slug } = input;

		if (parentID) {
			await this.checkIfParentCategoryExists(parentID);
		}

		const generatedSlug = slug ?? Slugify.generate(name);

		if (await this.checkIfSlugExists(generatedSlug))
			throw new CategoryAlreadyExistsException(name);

		const category = Category.create({
			name,
			parentID: parentID,
			slug: generatedSlug,
		});

		await this.categoryWriter.create(category);

		return {
			id: category.id,
			name: category.name,
			createdAt: category.createdAt,
			updatedAt: category.updatedAt,
			parentID: category.parentID,
			slug: category.slug!,
		};
	}

	private async checkIfParentCategoryExists(parentID: string): Promise<void> {
		const parentCategory = await this.categoryReader.findByID(parentID);
		if (!parentCategory) {
			throw new CategoryNotFoundException(parentID);
		}
	}

	private async checkIfSlugExists(slug: string): Promise<boolean> {
		const checkSlug = await this.categoryReader.existBySlug(slug);
		if (checkSlug) return true;
		else return false;
	}
}

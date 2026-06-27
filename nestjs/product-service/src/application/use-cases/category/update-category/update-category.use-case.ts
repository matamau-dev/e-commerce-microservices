import {
	CategoryReader,
	CategoryWriter,
} from 'src/domain/repositories/category/category.repository';
import { UpdateCategoryInput } from './update-category.input';
import { UpdateCategoryOutput } from './update-category.output';
import { Category } from 'src/domain/entities/category/category.entity';
import { CategoryNotFoundException } from 'src/domain/exceptions/category/category-not-found.exception';
import { CategoryCannotOwnParent } from 'src/domain/exceptions/category/category-cannot-own-parent';
import { Slugify } from 'src/shared/utils/slugify.util';
import { CategoryAlreadyExistsException } from 'src/domain/exceptions/category/category-already-exists.exception';
import { CategoryCircularReferenceException } from 'src/domain/exceptions/category/category-circular-reference.exception';

export class UpdateCategoryUseCase {
	constructor(
		private readonly categoryWriter: CategoryWriter,
		private readonly categoryReader: CategoryReader,
	) {}

	async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
		const category = await this.getCategoryOrThrow(input.id);

		if (input.parentID !== undefined) {
			await this.validateParentChange(category, input.parentID);
			category.changeParentID(input.parentID);
		}

		if (input.name !== undefined) {
			category.changeName(input.name);
		}

		const nextSlug = this.resolveSlug(input);

		if (nextSlug !== undefined) {
			await this.ensureSlugIsAvailable(nextSlug, category.id);
			category.changeSlug(nextSlug);
		}

		await this.categoryWriter.update(category);

		return {
			id: category.id,
			name: category.name,
			slug: category.slug,
			createdAt: category.createdAt,
			updatedAt: category.updatedAt,
			parentID: category.parentID,
		};
	}

	private async getCategoryOrThrow(id: string): Promise<Category> {
		const category = await this.categoryReader.findByID(id);

		if (!category) {
			throw new CategoryNotFoundException(id);
		}

		return category;
	}

	private async validateParentChange(
		category: Category,
		newParentID: string,
	): Promise<void> {
		if (category.id === newParentID) {
			throw new CategoryCannotOwnParent();
		}

		await this.getCategoryOrThrow(newParentID);
		await this.checkForCircularDependency(category.id, newParentID);
	}

	private resolveSlug(input: UpdateCategoryInput): string | undefined {
		if (input.slug !== undefined) {
			return input.slug;
		}

		if (input.name !== undefined) {
			return Slugify.generate(input.name);
		}

		return undefined;
	}

	private async ensureSlugIsAvailable(
		slug: string,
		categoryID: string,
	): Promise<void> {
		const slugAlreadyExists =
			await this.categoryReader.existsBySlugExcludingId(slug, categoryID);

		if (slugAlreadyExists) {
			throw new CategoryAlreadyExistsException(slug);
		}
	}

	private async checkForCircularDependency(
		categoryID: string,
		startParentID: string,
	): Promise<void> {
		const visited = new Set<string>();
		let currentParentID: string | undefined = startParentID;

		while (currentParentID) {
			if (currentParentID === categoryID) {
				throw new CategoryCircularReferenceException();
			}

			if (visited.has(currentParentID)) {
				throw new CategoryCircularReferenceException();
			}

			visited.add(currentParentID);

			const parent = await this.categoryReader.findByID(currentParentID);
			currentParentID = parent?.parentID;
		}
	}
}

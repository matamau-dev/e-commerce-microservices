import {
	CategoryReader,
	CategoryWriter,
} from 'src/domain/repositories/category/category.repository';
import { SoftDeleteCategoryInput } from './soft-delete-category.input';
import { SoftDeleteCategoryOutput } from './soft-delete-category.output';
import { CategoryHasChildrenException } from 'src/domain/exceptions/category/category-has-children.exception';
import { CategoryNotFoundException } from 'src/domain/exceptions/category/category-not-found.exception';

export class SoftDeleteCategoryUseCase {
	constructor(
		private readonly categoryReader: CategoryReader,
		private readonly categoryWriter: CategoryWriter,
	) {}

	async execute(
		input: SoftDeleteCategoryInput,
	): Promise<SoftDeleteCategoryOutput> {
		const category = await this.categoryReader.findByID(input.id);
		if (!category) throw new CategoryNotFoundException(input.id);

		const hasChildren = await this.categoryReader.hasActiveChildren(
			input.id,
		);
		if (hasChildren) throw new CategoryHasChildrenException();

		await this.categoryWriter.softDelete(input.id);

		return { message: 'Category has delete' };
	}
}

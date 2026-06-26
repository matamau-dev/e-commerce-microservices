import {
	CategoryReader,
	CategoryWriter,
} from 'src/domain/repositories/category/category.repository';
import { ListCategoryInput } from './list-category.input';
import { ListCategoryOutput } from './list-category.output';

export class ListCategoryUseCase {
	constructor(private readonly categoryReader: CategoryReader) {}

	async execute(input: ListCategoryInput): Promise<ListCategoryOutput> {
		const result = await this.categoryReader.findAll(input.query);

		return {
			...result,
			data: result.data.map((category) => ({
				id: category.id,
				name: category.name,
				slug: category.slug,
				parentID: category.parentID,
				createdAt: category.createdAt,
				updatedAt: category.updatedAt,
			})),
		};
	}
}

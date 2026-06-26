import { CategoryReader } from 'src/domain/repositories/category/category.repository';
import {
	CategoryTreeItem,
	ListCategoryTreeOutput,
} from './list-category-tree.output';
import { Category } from 'src/domain/entities/category/category.entity';

export class ListCategoryTreeUseCase {
	constructor(private readonly categoryReader: CategoryReader) {}

	async execute(): Promise<ListCategoryTreeOutput> {
		const categories = await this.categoryReader.findAllForTree();
		return this.buildTree(categories);
	}

	private buildTree(categories: Category[]): ListCategoryTreeOutput {
		const nodesById = this.createNodesById(categories);
		return this.linkNodes(categories, nodesById);
	}

	private createNodesById(
		categories: Category[],
	): Map<string, CategoryTreeItem> {
		const nodesById = new Map<string, CategoryTreeItem>();

		for (const category of categories) {
			nodesById.set(category.id, {
				id: category.id,
				name: category.name,
				slug: category.slug,
				children: [],
			});
		}

		return nodesById;
	}

	private linkNodes(
		categories: Category[],
		nodesById: Map<string, CategoryTreeItem>,
	): ListCategoryTreeOutput {
		const roots: CategoryTreeItem[] = [];

		for (const category of categories) {
			const node = nodesById.get(category.id);
			if (!node) continue;

			if (!category.parentID) {
				roots.push(node);
				continue;
			}

			const parent = nodesById.get(category.parentID);

			if (!parent) {
				continue;
			}

			parent.children.push(node);
		}

		return roots;
	}
}

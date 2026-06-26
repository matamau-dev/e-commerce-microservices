export interface CategoryTreeItem {
	id: string;
	name: string;
	slug?: string;
	children: CategoryTreeItem[];
}

export type ListCategoryTreeOutput = CategoryTreeItem[];

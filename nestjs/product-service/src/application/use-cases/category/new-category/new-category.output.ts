export interface NewCategoryOutput {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	slug: string;
	parentID?: string;
}

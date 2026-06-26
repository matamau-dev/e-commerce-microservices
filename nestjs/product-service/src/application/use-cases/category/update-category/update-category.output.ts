export interface UpdateCategoryOutput {
	id: string;
	name: string;
	slug?: string;
	createdAt: Date;
	updatedAt: Date;
	parentID?: string;
}

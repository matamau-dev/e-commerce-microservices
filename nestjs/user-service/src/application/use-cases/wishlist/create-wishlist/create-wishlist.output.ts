export interface CreateWishlistOutput {
	id: string;
	userId: string;
	name?: string;
	isPrivate: boolean;
	isDefault: boolean;
	alreadyExists?: boolean;
	createdAt: Date;
}

export interface GetWishlistOutput {
	id: string;
	userId: string;
	name?: string;
	isPrivate: boolean;
	isDefault: boolean;
	items: FindOneWishlistItemOutput[];
	shares: FindOneWishlistShareOutput[];
	createdAt: Date;
	updatedAt?: Date;
}

interface FindOneWishlistItemOutput {
	id: string;
	productId: string;
	createdAt: Date;
}

interface FindOneWishlistShareOutput {
	id: string;
	sharedWithUserId: string;
	createdAt: Date;
}

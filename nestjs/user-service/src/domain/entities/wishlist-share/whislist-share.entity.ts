export class WishlistShare {
	private constructor(
		public readonly id: string,
		public readonly wishlistId: string,
		public readonly sharedWithUserId: string,
		public readonly createdAt: Date,
	) {}

	// Crear nuevo share
	static create(wishlistId: string, sharedWithUserId: string): WishlistShare {
		return new WishlistShare(
			crypto.randomUUID(),
			wishlistId,
			sharedWithUserId,
			new Date(),
		);
	}

	// Reconstruir desde DB
	static fromPersistence(input: {
		id: string;
		wishlistId: string;
		sharedWithUserId: string;
		createdAt: Date;
	}): WishlistShare {
		return new WishlistShare(
			input.id,
			input.wishlistId,
			input.sharedWithUserId,
			input.createdAt,
		);
	}
}

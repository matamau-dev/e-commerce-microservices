export class WishlistItem {
	private constructor(
		public readonly id: string,
		public readonly wishlistId: string,
		public readonly productId: string,
		public readonly createdAt: Date,
	) {}

	// Crear nuevo
	static create(wishlistId: string, productId: string): WishlistItem {
		return new WishlistItem(
			crypto.randomUUID(),
			wishlistId,
			productId,
			new Date(),
		);
	}

	// Reconstruir desde DB
	static fromPersistence(input: {
		id: string;
		wishlistId: string;
		productId: string;
		createdAt: Date;
	}): WishlistItem {
		return new WishlistItem(
			input.id,
			input.wishlistId,
			input.productId,
			input.createdAt,
		);
	}
}

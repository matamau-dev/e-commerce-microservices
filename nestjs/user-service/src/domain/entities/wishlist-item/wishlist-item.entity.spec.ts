import { WishlistItem } from './wishlist-item.entity';

describe('WishlistItem Entity', () => {
	describe('create', () => {
		it('should correctly create a WishlistItem instance with a generated UUID and current date', () => {
			const item = WishlistItem.create('wishlist-id', 'product-id');

			expect(item.id).toBeDefined();
			expect(item.wishlistId).toBe('wishlist-id');
			expect(item.productId).toBe('product-id');
			expect(item.createdAt).toBeInstanceOf(Date);
		});
	});

	describe('fromPersistence', () => {
		it('should correctly restore a WishlistItem instance from persistence data', () => {
			const createdAt = new Date();

			const item = WishlistItem.fromPersistence({
				id: 'item-id',
				wishlistId: 'wishlist-id',
				productId: 'product-id',
				createdAt,
			});

			expect(item.id).toBe('item-id');
			expect(item.wishlistId).toBe('wishlist-id');
			expect(item.productId).toBe('product-id');
			expect(item.createdAt).toBe(createdAt);
		});
	});
});

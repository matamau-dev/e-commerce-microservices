import { WishlistShare } from './whislist-share.entity';

describe('WishlistShare Entity', () => {
	describe('create', () => {
		it('should correctly create a WishlistShare instance with a generated UUID and current date', () => {
			const share = WishlistShare.create('wishlist-id', 'user-id');

			expect(share.id).toBeDefined();
			expect(share.wishlistId).toBe('wishlist-id');
			expect(share.sharedWithUserId).toBe('user-id');
			expect(share.createdAt).toBeInstanceOf(Date);
		});
	});

	describe('fromPersistence', () => {
		it('should correctly restore a WishlistShare instance from persistence data', () => {
			const createdAt = new Date();

			const share = WishlistShare.fromPersistence({
				id: 'share-id',
				wishlistId: 'wishlist-id',
				sharedWithUserId: 'user-id',
				createdAt,
			});

			expect(share.id).toBe('share-id');
			expect(share.wishlistId).toBe('wishlist-id');
			expect(share.sharedWithUserId).toBe('user-id');
			expect(share.createdAt).toBe(createdAt);
		});
	});
});

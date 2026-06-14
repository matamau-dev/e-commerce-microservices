import { Wishlist } from './wishlist.entity';
import { ProductNotInWishlistException } from 'src/domain/exceptions/wishlist/product-not-in-wishlist.exception';
import { ProductAlreadyInWishlistException } from 'src/domain/exceptions/wishlist/product-already-in-wishlist.exception';
import { WishlistAlreadySharedException } from 'src/domain/exceptions/wishlist/wishlist-already-shared.exception';
import { WishlistShareNotFoundException } from 'src/domain/exceptions/wishlist/whislist-share-not-found.exception';
import { CannotShareWithOwnerException } from 'src/domain/exceptions/wishlist/cannot-share-with-ower.exception';

describe('Wishlist Entity', () => {
	describe('create', () => {
		it('should create a Wishlist instance with default private status and empty items/shares lists', () => {
			const wishlist = Wishlist.create({
				userId: 'user-id',
				name: 'Favoritos',
			});

			expect(wishlist.id).toBeDefined();
			expect(wishlist.userId).toBe('user-id');
			expect(wishlist.name).toBe('Favoritos');
			expect(wishlist.isPrivate).toBe(true);
			expect(wishlist.isDefault).toBe(false);
			expect(wishlist.items).toHaveLength(0);
			expect(wishlist.shares).toHaveLength(0);
			expect(wishlist.createdAt).toBeInstanceOf(Date);
		});
	});

	describe('fromPersistence', () => {
		it('should correctly restore a Wishlist instance from persistence data', () => {
			const createdAt = new Date();

			const wishlist = Wishlist.fromPersistence({
				id: 'wishlist-id',
				userId: 'user-id',
				isPrivate: false,
				name: 'Lista',
				normalizedName: 'lista',
				isDefault: true,
				items: [],
				shares: [],
				createdAt,
			});

			expect(wishlist.id).toBe('wishlist-id');
			expect(wishlist.isPrivate).toBe(false);
			expect(wishlist.isDefault).toBe(true);
			expect(wishlist.createdAt).toBe(createdAt);
		});
	});

	describe('normalize', () => {
		it('should trim whitespace and lowercase the name text', () => {
			const normalized = Wishlist.normalize('  Mi LISTA   Favorita  ');

			expect(normalized).toBe('mi lista favorita');
		});
	});

	describe('items management', () => {
		describe('addItem', () => {
			it('should add a new product to the wishlist and update the updatedAt date', () => {
				const wishlist = Wishlist.create({
					userId: 'user-id',
				});

				const item = wishlist.addItem('product-id');

				expect(item.productId).toBe('product-id');
				expect(wishlist.items).toHaveLength(1);
				expect(wishlist.updatedAt).toBeInstanceOf(Date);
			});

			it('should throw ProductAlreadyInWishlistException when the product already exists in the wishlist', () => {
				const wishlist = Wishlist.create({
					userId: 'user-id',
				});

				wishlist.addItem('product-id');

				expect(() => {
					wishlist.addItem('product-id');
				}).toThrow(ProductAlreadyInWishlistException);
			});
		});

		describe('removeItem', () => {
			it('should remove the product from the wishlist and update the updatedAt date', () => {
				const wishlist = Wishlist.create({
					userId: 'user-id',
				});

				wishlist.addItem('product-id');
				wishlist.removeItem('product-id');

				expect(wishlist.items).toHaveLength(0);
				expect(wishlist.updatedAt).toBeInstanceOf(Date);
			});

			it('should throw ProductNotInWishlistException when attempting to remove a non-existent product', () => {
				const wishlist = Wishlist.create({
					userId: 'user-id',
				});

				expect(() => {
					wishlist.removeItem('producto-inexistente');
				}).toThrow(ProductNotInWishlistException);
			});
		});

		describe('hasProduct', () => {
			it('should return true if the product is in the wishlist, and false otherwise', () => {
				const wishlist = Wishlist.create({
					userId: 'user-id',
				});

				wishlist.addItem('product-id');

				expect(wishlist.hasProduct('product-id')).toBe(true);
				expect(wishlist.hasProduct('otro-producto')).toBe(false);
			});
		});
	});

	describe('shares management', () => {
		describe('shareWith', () => {
			it('should add a WishlistShare entry and update the updatedAt date', () => {
				const wishlist = Wishlist.create({
					userId: 'owner-id',
				});

				const share = wishlist.shareWith('friend-id');

				expect(share.sharedWithUserId).toBe('friend-id');
				expect(wishlist.shares).toHaveLength(1);
				expect(wishlist.updatedAt).toBeInstanceOf(Date);
			});

			it('should throw CannotShareWithOwnerException when attempting to share with the owner', () => {
				const wishlist = Wishlist.create({
					userId: 'owner-id',
				});

				expect(() => {
					wishlist.shareWith('owner-id');
				}).toThrow(CannotShareWithOwnerException);
			});

			it('should throw WishlistAlreadySharedException when attempting to share with a user who already has access', () => {
				const wishlist = Wishlist.create({
					userId: 'owner-id',
				});

				wishlist.shareWith('user-1');

				expect(() => {
					wishlist.shareWith('user-1');
				}).toThrow(WishlistAlreadySharedException);
			});
		});

		describe('unshare', () => {
			it('should remove the WishlistShare entry and update the updatedAt date', () => {
				const wishlist = Wishlist.create({
					userId: 'owner-id',
				});

				wishlist.shareWith('friend-id');
				wishlist.unshare('friend-id');

				expect(wishlist.shares).toHaveLength(0);
				expect(wishlist.updatedAt).toBeInstanceOf(Date);
			});

			it('should throw WishlistShareNotFoundException when attempting to unshare with a user who is not currently shared with', () => {
				const wishlist = Wishlist.create({ userId: 'owner-id' });

				expect(() => {
					wishlist.unshare('friend-id');
				}).toThrow(WishlistShareNotFoundException);
			});
		});
	});

	describe('privacy status management', () => {
		describe('makePrivate', () => {
			it('should change status to private, clear all shares, and update the updatedAt date', () => {
				const wishlist = Wishlist.create({
					userId: 'user-id',
					isPrivate: false,
				});

				wishlist.shareWith('friend-id');
				wishlist.makePrivate();

				expect(wishlist.isPrivate).toBe(true);
				expect(wishlist.shares).toHaveLength(0);
				expect(wishlist.updatedAt).toBeInstanceOf(Date);
			});

			it('should do nothing and not modify updatedAt if the wishlist is already private', () => {
				const wishlist = Wishlist.create({
					userId: 'owner-id',
				});

				wishlist.makePrivate();

				const previousSharesLength = wishlist.shares.length;
				const previousUpdatedAt = wishlist.updatedAt;

				wishlist.makePrivate();

				expect(wishlist.isPrivate).toBe(true);
				expect(wishlist.shares).toHaveLength(previousSharesLength);
				expect(wishlist.updatedAt).toBe(previousUpdatedAt);
			});
		});

		describe('makePublic', () => {
			it('should change status to public and update the updatedAt date', () => {
				const wishlist = Wishlist.create({
					userId: 'user-id',
					isPrivate: true,
				});

				wishlist.makePublic();

				expect(wishlist.isPrivate).toBe(false);
				expect(wishlist.updatedAt).toBeInstanceOf(Date);
			});

			it('should do nothing and not modify updatedAt if the wishlist is already public', () => {
				const wishlist = Wishlist.create({
					userId: 'owner-id',
				});
				wishlist.makePublic();
				const previousUpdatedAt = wishlist.updatedAt;

				wishlist.makePublic();

				expect(wishlist.isPrivate).toBe(false);
				expect(wishlist.updatedAt).toBe(previousUpdatedAt);
			});
		});
	});

	describe('default state management', () => {
		describe('markAsDefault', () => {
			it('should set isDefault to true and update the updatedAt date', () => {
				const wishlist = Wishlist.create({
					userId: 'user-id',
				});

				wishlist.markAsDefault();

				expect(wishlist.isDefault).toBe(true);
				expect(wishlist.updatedAt).toBeInstanceOf(Date);
			});

			it('should do nothing and not modify updatedAt if it is already default', () => {
				const wishlist = Wishlist.create({
					userId: 'owner-id',
				});

				wishlist.markAsDefault();
				const before = wishlist.isDefault;
				const previousUpdatedAt = wishlist.updatedAt;

				wishlist.markAsDefault();

				expect(wishlist.isDefault).toBe(before);
				expect(wishlist.updatedAt).toBe(previousUpdatedAt);
			});
		});

		describe('unmarkAsDefault', () => {
			it('should set isDefault to false and update the updatedAt date', () => {
				const wishlist = Wishlist.fromPersistence({
					id: 'wishlist-id',
					userId: 'user-id',
					isPrivate: true,
					isDefault: true,
					items: [],
					shares: [],
					createdAt: new Date(),
				});

				wishlist.unmarkAsDefault();

				expect(wishlist.isDefault).toBe(false);
				expect(wishlist.updatedAt).toBeInstanceOf(Date);
			});

			it('should do nothing and not modify updatedAt if it is already not default', () => {
				const wishlist = Wishlist.create({
					userId: 'owner-id',
				});

				wishlist.unmarkAsDefault();
				const before = wishlist.isDefault;
				const previousUpdatedAt = wishlist.updatedAt;

				wishlist.unmarkAsDefault();

				expect(wishlist.isDefault).toBe(before);
				expect(wishlist.updatedAt).toBe(previousUpdatedAt);
			});
		});
	});

	describe('belongsTo', () => {
		it('should return true if the wishlist belongs to the user, and false otherwise', () => {
			const wishlist = Wishlist.create({
				userId: 'user-id',
			});

			expect(wishlist.belongsTo('user-id')).toBe(true);
			expect(wishlist.belongsTo('otro-user')).toBe(false);
		});
	});

	describe('rename', () => {
		it('should update the wishlist name and set the updatedAt date', () => {
			const wishlist = Wishlist.create({
				userId: 'user-id',
				name: 'Viejo nombre',
			});

			wishlist.rename('Nuevo nombre');

			expect(wishlist.name).toBe('Nuevo nombre');
			expect(wishlist.updatedAt).toBeInstanceOf(Date);
		});

		it('should do nothing and not modify updatedAt if the new name is identical', () => {
			const wishlist = Wishlist.create({
				userId: 'owner-id',
				name: 'Favoritos',
			});

			const before = wishlist.name;
			const previousUpdatedAt = wishlist.updatedAt;

			wishlist.rename(before!);

			expect(wishlist.name).toBe(before);
			expect(wishlist.updatedAt).toBe(previousUpdatedAt);
		});
	});
});

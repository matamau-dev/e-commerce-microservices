import { Wishlist } from 'src/domain/entities/wishlist/wishlist.entity';
import { WishlistOrmEntity } from '../database/postgres/orm-entities/whislist/wishlist.orm-entity';
import { WishlistItem } from 'src/domain/entities/wishlist-item/wishlist-item.entity';
import { WishlistShare } from 'src/domain/entities/wishlist-share/whislist-share.entity';

export class WishListMapper {
	private constructor() {}

	static WishlistOrmToWishlistDomain(orm: WishlistOrmEntity): Wishlist {
		return Wishlist.fromPersistence({
			id: orm.id,
			name: orm.name,
			isPrivate: orm.isPrivate,
			isDefault: orm.isDefault,
			userId: orm.userId,
			items:
				orm.items?.map((item) =>
					WishlistItem.fromPersistence({
						id: item.id,
						wishlistId: item.wishlistId,
						productId: item.productId,
						createdAt: item.createdAt,
					}),
				) ?? [],
			shares:
				orm.shares?.map((share) =>
					WishlistShare.fromPersistence({
						id: share.id,
						wishlistId: share.wishlistId,
						sharedWithUserId: share.sharedWithUserId,
						createdAt: share.createdAt,
					}),
				) ?? [],
			createdAt: orm.created_at,
			updatedAt: orm.updated_at,
		});
	}

	static WishlistDomainToWishlistOrm(
		wishlist: Wishlist,
	): Partial<WishlistOrmEntity> {
		return {
			id: wishlist.id,
			userId: wishlist.userId,
			name: wishlist.name,
			normalizedName: wishlist.normalizeName,
			isPrivate: wishlist.isPrivate,
			isDefault: wishlist.isDefault,
			created_at: wishlist.createdAt,
			updated_at: wishlist.updatedAt,

			items: wishlist.items.map((item) => ({
				id: item.id,
				wishlistId: item.wishlistId,
				productId: item.productId,
				createdAt: item.createdAt,
			})),

			shares: wishlist.shares.map((share) => ({
				id: share.id,
				wishlistId: share.wishlistId,
				sharedWithUserId: share.sharedWithUserId,
				createdAt: share.createdAt,
			})),
		};
	}
}

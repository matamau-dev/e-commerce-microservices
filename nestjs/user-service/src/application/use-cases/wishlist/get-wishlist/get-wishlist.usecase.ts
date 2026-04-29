import { WishlistReader } from 'src/domain/repositories/wishlist/wishlist.repository';
import { GetWishlistInput } from './get-wishlist.input';
import { GetWishlistOutput } from './get-wishlist.output';
import { WishlistShareNotFoundException } from 'src/domain/exceptions/wishlist/whislist-share-not-found.exception';
import { UnauthorizedWishlistAccessException } from 'src/domain/exceptions/wishlist/unauthorized-wishlist-access.exception';

export class GetWishlistUseCase {
	constructor(private readonly wishlistReader: WishlistReader) {}

	async execute(input: GetWishlistInput): Promise<GetWishlistOutput> {
		const list = await this.wishlistReader.findById(input.id, input.userId);
		if (!list) throw new WishlistShareNotFoundException();
		if (!list.belongsTo(input.userId))
			throw new UnauthorizedWishlistAccessException();
		return {
			id: list.id,
			userId: list.userId,
			name: list.name,
			isPrivate: list.isPrivate,
			isDefault: list.isDefault,
			items: list.items,
			shares: list.shares,
			createdAt: list.createdAt,
			updatedAt: list.updatedAt,
		};
	}
}

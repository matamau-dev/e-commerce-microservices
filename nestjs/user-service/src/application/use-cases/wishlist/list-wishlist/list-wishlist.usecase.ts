import { WishlistReader } from 'src/domain/repositories/wishlist/wishlist.repository';
import { ListWishInput } from './list-wishlist.input';
import { ListWishOutPut } from './list-wishlist.output';
import { WishlistShareNotFoundException } from 'src/domain/exceptions/wishlist/whislist-share-not-found.exception';

export class ListWishUseCase {
	constructor(private readonly wishlistReader: WishlistReader) {}

	async execute(input: ListWishInput): Promise<ListWishOutPut> {
		const result = await this.wishlistReader.findAll(
			input.userId,
			input.query,
		);
		if (result.data.length === 0) {
			throw new WishlistShareNotFoundException();
		}
		return {
			...result,
			data: result.data.map((wishlist) => ({
				id: wishlist.id,
				name: wishlist.name,
				isPrivate: wishlist.isPrivate,
				isDefault: wishlist.isDefault,
				itemsCount: Number(wishlist.items.length),
				sharesCount: Number(wishlist.shares.length),
				createdAt: wishlist.createdAt,
				updatedAt: wishlist.updatedAt,
			})),
		};
	}
}

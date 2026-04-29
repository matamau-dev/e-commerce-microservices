import {
	WishlistReader,
	WishlistWriter,
} from 'src/domain/repositories/wishlist/wishlist.repository';
import { RemoveItemInput } from './remove-item.input';
import { RemoveItemOutput } from './remove-item.output';
import { WishlistShareNotFoundException } from 'src/domain/exceptions/wishlist/whislist-share-not-found.exception';
import { UnauthorizedWishlistAccessException } from 'src/domain/exceptions/wishlist/unauthorized-wishlist-access.exception';

export class RemoveItemUseCase {
	constructor(
		private readonly wishlistReader: WishlistReader,
		private readonly wishlistWriter: WishlistWriter,
	) {}

	async execute(input: RemoveItemInput): Promise<RemoveItemOutput> {
		const wishlist = await this.wishlistReader.findById(
			input.id,
			input.userId,
		);
		console.log('wishlist => ', wishlist);
		if (!wishlist) throw new WishlistShareNotFoundException();
		if (!wishlist.belongsTo(input.userId))
			throw new UnauthorizedWishlistAccessException();
		wishlist.removeItem(input.productId);
		await this.wishlistWriter.removeItem(wishlist.id, input.productId);
		await this.wishlistWriter.save(wishlist);
		return { success: true };
	}
}

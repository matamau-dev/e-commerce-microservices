import { WishlistReader } from 'src/domain/repositories/wishlist/wishlist.repository';
import { WishlistWriter } from '../../../../domain/repositories/wishlist/wishlist.repository';
import { AddItemOutput } from './add-item.output';
import { AddItemInput } from './add-item.input';
import { WishlistShareNotFoundException } from 'src/domain/exceptions/wishlist/whislist-share-not-found.exception';
import { UnauthorizedWishlistAccessException } from 'src/domain/exceptions/wishlist/unauthorized-wishlist-access.exception';

export class AddItemUseCase {
	constructor(
		private readonly wishlistReader: WishlistReader,
		private readonly wishlistWriter: WishlistWriter,
	) {}

	async execute(input: AddItemInput): Promise<AddItemOutput> {
		const wishlist = await this.wishlistReader.findById(
			input.wishlistId,
			input.userId,
		);

		if (!wishlist) {
			throw new WishlistShareNotFoundException();
		}

		if (!wishlist.belongsTo(input.userId)) {
			throw new UnauthorizedWishlistAccessException();
		}

		const item = wishlist.addItem(input.productId);

		await this.wishlistWriter.save(wishlist);

		return {
			id: item.id,
			wishlistId: item.wishlistId,
			productId: item.productId,
			createdAt: item.createdAt,
		};
	}
}

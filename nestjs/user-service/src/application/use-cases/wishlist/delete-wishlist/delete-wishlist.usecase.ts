import {
	WishlistReader,
	WishlistWriter,
} from 'src/domain/repositories/wishlist/wishlist.repository';
import { DeleteWishlistInput } from './delete-wishlist.input';
import { DeleteWishlistOutput } from './delete-wishlist.output';
import { WishlistShareNotFoundException } from 'src/domain/exceptions/wishlist/whislist-share-not-found.exception';
import { UnauthorizedWishlistAccessException } from 'src/domain/exceptions/wishlist/unauthorized-wishlist-access.exception';

export class DeleteWishlistUseCase {
	constructor(
		private readonly wishlistReader: WishlistReader,
		private readonly wishlistWriter: WishlistWriter,
	) {}

	async execute(input: DeleteWishlistInput): Promise<DeleteWishlistOutput> {
		const wishlist = await this.wishlistReader.findById(
			input.id,
			input.userId,
		);
		if (!wishlist) throw new WishlistShareNotFoundException();

		if (!wishlist.belongsTo(input.userId)) {
			throw new UnauthorizedWishlistAccessException();
		}

		if (wishlist.isDefault) {
			await this.wishlistWriter.deleteAndPromoteCandidate(
				input.id,
				input.userId,
			);
			return { success: true };
		}

		await this.wishlistWriter.softDelete(input.id);
		return { success: true };
	}
}

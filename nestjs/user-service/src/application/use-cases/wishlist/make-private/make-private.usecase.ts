import {
	WishlistReader,
	WishlistWriter,
} from 'src/domain/repositories/wishlist/wishlist.repository';
import { MakePrivateInput } from './make-private.input';
import { MakePrivateOutput } from './make-private.output';
import { WishlistShareNotFoundException } from 'src/domain/exceptions/wishlist/whislist-share-not-found.exception';
import { UnauthorizedWishlistAccessException } from 'src/domain/exceptions/wishlist/unauthorized-wishlist-access.exception';

export class MakePrivateUseCase {
	constructor(
		private readonly wishlistReader: WishlistReader,
		private readonly wishlistWriter: WishlistWriter,
	) {}

	async execute(input: MakePrivateInput): Promise<MakePrivateOutput> {
		const wishlist = await this.wishlistReader.findById(
			input.id,
			input.userId,
		);
		if (!wishlist) throw new WishlistShareNotFoundException();
		if (!wishlist.belongsTo(input.userId))
			throw new UnauthorizedWishlistAccessException();
		wishlist.makePrivate();
		await this.wishlistWriter.save(wishlist);
		return { success: true };
	}
}

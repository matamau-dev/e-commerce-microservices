import {
	WishlistReader,
	WishlistWriter,
} from 'src/domain/repositories/wishlist/wishlist.repository';
import { MakePublicInput } from './make-public.input';
import { MakePublicOutput } from './make-public.output';
import { WishlistShareNotFoundException } from 'src/domain/exceptions/wishlist/whislist-share-not-found.exception';
import { UnauthorizedWishlistAccessException } from 'src/domain/exceptions/wishlist/unauthorized-wishlist-access.exception';

export class MakePublicUseCase {
	constructor(
		private readonly wishlistReader: WishlistReader,
		private readonly wishlistWriter: WishlistWriter,
	) {}

	async execute(input: MakePublicInput): Promise<MakePublicOutput> {
		const wishlist = await this.wishlistReader.findById(
			input.id,
			input.userId,
		);
		if (!wishlist) throw new WishlistShareNotFoundException();
		if (!wishlist.belongsTo(input.userId))
			throw new UnauthorizedWishlistAccessException();
		wishlist.makePublic();
		await this.wishlistWriter.save(wishlist);
		return { success: true };
	}
}

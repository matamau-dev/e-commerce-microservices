import {
	WishlistReader,
	WishlistWriter,
} from 'src/domain/repositories/wishlist/wishlist.repository';
import { ShareWishlistInput } from './share-wishlist.input';
import { ShareWishlistOutput } from './share-wishlist.output';
import { WishlistShareNotFoundException } from 'src/domain/exceptions/wishlist/whislist-share-not-found.exception';
import { UserReader } from 'src/domain/repositories/user/user.repository';
import { UnauthorizedWishlistAccessException } from 'src/domain/exceptions/wishlist/unauthorized-wishlist-access.exception';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';

export class ShareWishlistUseCase {
	constructor(
		private readonly wishlistReader: WishlistReader,
		private readonly wishlistWriter: WishlistWriter,
		private readonly userReader: UserReader,
	) {}

	async execute(input: ShareWishlistInput): Promise<ShareWishlistOutput> {
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

		const user = await this.userReader.findById(input.sharedWithUserId);

		if (!user) {
			throw new UserNotFoundException(input.sharedWithUserId);
		}

		wishlist.shareWith(input.sharedWithUserId);

		await this.wishlistWriter.save(wishlist);

		return { success: true };
	}
}

import {
	WishlistReader,
	WishlistWriter,
} from 'src/domain/repositories/wishlist/wishlist.repository';
import { AddProductToMyWishlistInput } from './add-item-to-my-wishlist.input';
import { AddProductToMyWishlistOutput } from './add-item-to-my-wishlist.output';
import { Wishlist } from 'src/domain/entities/wishlist/wishlist.entity';

export class AddProductToMyWishlistUseCase {
	constructor(
		private readonly wishlistReader: WishlistReader,
		private readonly wishlistWriter: WishlistWriter,
	) {}

	async execute(
		input: AddProductToMyWishlistInput,
	): Promise<AddProductToMyWishlistOutput> {
		let wishlist = await this.wishlistReader.findDefaultByUserId(
			input.userId,
		);

		if (!wishlist) {
			wishlist = Wishlist.create({
				userId: input.userId,
				isPrivate: true,
			});

			wishlist.markAsDefault();
		}

		const item = wishlist.addItem(input.productId);

		await this.wishlistWriter.save(wishlist);

		return {
			wishlistId: wishlist.id,
			productId: item.productId,
			createdAt: item.createdAt,
		};
	}
}

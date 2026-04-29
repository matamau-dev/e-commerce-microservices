import { UserReader } from 'src/domain/repositories/user/user.repository';
import { WishlistWriter } from 'src/domain/repositories/wishlist/wishlist.repository';
import { CreateWishlistInput } from './create-wishlist.input';
import { Wishlist } from 'src/domain/entities/wishlist/wishlist.entity';
import { CreateWishlistOutput } from './create-wishlist.output';
import { WishlistReader } from '../../../../domain/repositories/wishlist/wishlist.repository';

export class CreateWishlistUseCase {
	constructor(
		private readonly wishlistWriter: WishlistWriter,
		private readonly wishlistReader: WishlistReader,
	) {}

	async execute(input: CreateWishlistInput): Promise<CreateWishlistOutput> {
		let result: Wishlist | null = null;

		if (input.name) {
			result = await this.wishlistReader.findByNormalizeName(
				input.userId,
				Wishlist.normalize(input.name),
			);

			if (result) {
				return {
					id: result.id,
					name: result.name,
					userId: result.userId,
					isDefault: result.isDefault,
					isPrivate: result.isPrivate,
					createdAt: result.createdAt,
					alreadyExists: true,
				};
			}
		}

		const wishlist = Wishlist.create({
			userId: input.userId,
			name: input.name,
			normalizedName: input.name,
			isPrivate: input.isPrivate,
		});
		const existingDefault = await this.wishlistReader.findDefaultByUserId(
			input.userId,
		);

		if (!existingDefault) {
			wishlist.markAsDefault();
		}
		await this.wishlistWriter.save(wishlist);

		return {
			id: wishlist.id,
			userId: wishlist.userId,
			name: wishlist.name,
			isDefault: wishlist.isDefault,
			isPrivate: wishlist.isPrivate,
			createdAt: wishlist.createdAt,
		};
	}
}

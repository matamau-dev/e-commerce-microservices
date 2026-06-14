import { Wishlist } from 'src/domain/entities/wishlist/wishlist.entity';
import { AddItemUseCase } from './add-item.usecase';
import { WishlistShareNotFoundException } from 'src/domain/exceptions/wishlist/whislist-share-not-found.exception';
import { UnauthorizedWishlistAccessException } from 'src/domain/exceptions/wishlist/unauthorized-wishlist-access.exception';

describe('AddItemUseCase', () => {
	let wishlistReader: any;
	let wishlistWriter: any;
	let useCase: AddItemUseCase;

	beforeEach(() => {
		wishlistReader = {
			findById: jest.fn(),
		};

		wishlistWriter = {
			save: jest.fn(),
		};

		useCase = new AddItemUseCase(wishlistReader, wishlistWriter);
	});

	describe('execute', () => {
		it('should successfully add an item to the wishlist when the wishlist belongs to the user', async () => {
			const wishlist = Wishlist.create({
				userId: 'user-id',
			});

			wishlistReader.findById.mockResolvedValue(wishlist);

			const result = await useCase.execute({
				wishlistId: wishlist.id,
				userId: 'user-id',
				productId: 'product-id',
			});

			expect(wishlistWriter.save).toHaveBeenCalledWith(wishlist);
			expect(result.productId).toBe('product-id');
			expect(wishlist.items).toHaveLength(1);
		});

		it('should throw WishlistShareNotFoundException when the wishlist does not exist', async () => {
			wishlistReader.findById.mockResolvedValue(null);

			await expect(
				useCase.execute({
					wishlistId: 'wishlist-id',
					userId: 'user-id',
					productId: 'product-id',
				}),
			).rejects.toThrow(WishlistShareNotFoundException);
		});

		it('should throw UnauthorizedWishlistAccessException when the wishlist is owned by another user', async () => {
			const wishlist = Wishlist.create({
				userId: 'owner-id',
			});

			wishlistReader.findById.mockResolvedValue(wishlist);

			await expect(
				useCase.execute({
					wishlistId: wishlist.id,
					userId: 'otro-user',
					productId: 'product-id',
				}),
			).rejects.toThrow(UnauthorizedWishlistAccessException);
		});
	});
});

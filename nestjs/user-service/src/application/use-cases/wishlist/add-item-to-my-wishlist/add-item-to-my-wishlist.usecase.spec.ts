import { Wishlist } from 'src/domain/entities/wishlist/wishlist.entity';
import { AddProductToMyWishlistUseCase } from './add-item-to-my-wishlist.usecase';

describe('AddProductToMyWishlistUseCase', () => {
	let wishlistReader: any;
	let wishlistWriter: any;
	let useCase: AddProductToMyWishlistUseCase;

	beforeEach(() => {
		wishlistReader = {
			findDefaultByUserId: jest.fn(),
		};

		wishlistWriter = {
			save: jest.fn(),
		};

		useCase = new AddProductToMyWishlistUseCase(
			wishlistReader,
			wishlistWriter,
		);
	});

	describe('execute', () => {
		it('should add the product to the existing default wishlist of the user and save it', async () => {
			const wishlist = Wishlist.create({
				userId: 'user-id',
			});

			wishlist.markAsDefault();

			wishlistReader.findDefaultByUserId.mockResolvedValue(wishlist);

			const result = await useCase.execute({
				userId: 'user-id',
				productId: 'product-id',
			});

			expect(wishlistWriter.save).toHaveBeenCalledWith(wishlist);
			expect(result.productId).toBe('product-id');
			expect(wishlist.items).toHaveLength(1);
		});

		it('should create and save a new default wishlist for the user and add the product when no default wishlist exists', async () => {
			wishlistReader.findDefaultByUserId.mockResolvedValue(null);

			const result = await useCase.execute({
				userId: 'user-id',
				productId: 'product-id',
			});

			expect(wishlistWriter.save).toHaveBeenCalled();
			expect(result.productId).toBe('product-id');
		});
	});
});

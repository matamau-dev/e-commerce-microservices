import { Wishlist } from 'src/domain/entities/wishlist/wishlist.entity';
import { RemoveItemUseCase } from './remove-item.usecase';
import { UnauthorizedWishlistAccessException } from 'src/domain/exceptions/wishlist/unauthorized-wishlist-access.exception';
import { WishlistShareNotFoundException } from 'src/domain/exceptions/wishlist/whislist-share-not-found.exception';

describe('RemoveItemUseCase', () => {
	let wishlistReader: any;
	let wishlistWriter: any;

	let useCase: RemoveItemUseCase;

	beforeEach(() => {
		wishlistReader = {
			findById: jest.fn(),
		};

		wishlistWriter = {
			removeItem: jest.fn(),
			save: jest.fn(),
		};

		useCase = new RemoveItemUseCase(wishlistReader, wishlistWriter);
	});

	it('debería remover item', async () => {
		const wishlist = Wishlist.create({
			userId: 'user-id',
		});

		wishlist.addItem('product-id');

		wishlistReader.findById.mockResolvedValue(wishlist);

		const result = await useCase.execute({
			id: wishlist.id,
			userId: 'user-id',
			productId: 'product-id',
		});

		expect(wishlist.items).toHaveLength(0);

		expect(wishlistWriter.removeItem).toHaveBeenCalledWith(
			wishlist.id,
			'product-id',
		);

		expect(wishlistWriter.save).toHaveBeenCalledWith(wishlist);

		expect(result.success).toBe(true);
	});

	it('debería lanzar error si wishlist no existe', async () => {
		wishlistReader.findById.mockResolvedValue(null);

		await expect(
			useCase.execute({
				id: 'wishlist-id',
				userId: 'user-id',
				productId: 'product-id',
			}),
		).rejects.toThrow(WishlistShareNotFoundException);
	});

	it('debería lanzar error si usuario no es dueño', async () => {
		const wishlist = Wishlist.create({
			userId: 'owner-id',
		});

		wishlistReader.findById.mockResolvedValue(wishlist);

		await expect(
			useCase.execute({
				id: wishlist.id,
				userId: 'otro-user',
				productId: 'product-id',
			}),
		).rejects.toThrow(UnauthorizedWishlistAccessException);
	});
});

import { Wishlist } from 'src/domain/entities/wishlist/wishlist.entity';
import { GetWishlistUseCase } from './get-wishlist.usecase';
import { WishlistShareNotFoundException } from 'src/domain/exceptions/wishlist/whislist-share-not-found.exception';
import { UnauthorizedWishlistAccessException } from 'src/domain/exceptions/wishlist/unauthorized-wishlist-access.exception';

describe('GetWishlistUseCase', () => {
	let wishlistReader: any;

	let useCase: GetWishlistUseCase;

	beforeEach(() => {
		wishlistReader = {
			findById: jest.fn(),
		};

		useCase = new GetWishlistUseCase(wishlistReader);
	});

	it('debería obtener wishlist', async () => {
		const wishlist = Wishlist.create({
			userId: 'user-id',
			name: 'Favoritos',
		});

		wishlistReader.findById.mockResolvedValue(wishlist);

		const result = await useCase.execute({
			id: wishlist.id,
			userId: 'user-id',
		});

		expect(result.id).toBe(wishlist.id);

		expect(result.name).toBe('Favoritos');

		expect(result.userId).toBe('user-id');
	});

	it('debería lanzar error si wishlist no existe', async () => {
		wishlistReader.findById.mockResolvedValue(null);

		await expect(
			useCase.execute({
				id: 'wishlist-id',
				userId: 'user-id',
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
			}),
		).rejects.toThrow(UnauthorizedWishlistAccessException);
	});
});

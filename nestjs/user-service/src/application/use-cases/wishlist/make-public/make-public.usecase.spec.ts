import { Wishlist } from 'src/domain/entities/wishlist/wishlist.entity';
import { MakePublicUseCase } from './make-public.usecase';
import { UnauthorizedWishlistAccessException } from 'src/domain/exceptions/wishlist/unauthorized-wishlist-access.exception';
import { WishlistShareNotFoundException } from 'src/domain/exceptions/wishlist/whislist-share-not-found.exception';

describe('MakePublicUseCase', () => {
	let wishlistReader: any;
	let wishlistWriter: any;

	let useCase: MakePublicUseCase;

	beforeEach(() => {
		wishlistReader = {
			findById: jest.fn(),
		};

		wishlistWriter = {
			save: jest.fn(),
		};

		useCase = new MakePublicUseCase(wishlistReader, wishlistWriter);
	});

	it('debería hacer wishlist pública', async () => {
		const wishlist = Wishlist.create({
			userId: 'user-id',
		});

		wishlistReader.findById.mockResolvedValue(wishlist);

		const result = await useCase.execute({
			id: wishlist.id,
			userId: 'user-id',
		});

		expect(wishlist.isPrivate).toBe(false);

		expect(wishlistWriter.save).toHaveBeenCalledWith(wishlist);

		expect(result.success).toBe(true);
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

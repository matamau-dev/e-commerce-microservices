import { Wishlist } from 'src/domain/entities/wishlist/wishlist.entity';
import { MakePrivateUseCase } from './make-private.usecase';
import { WishlistShareNotFoundException } from 'src/domain/exceptions/wishlist/whislist-share-not-found.exception';
import { UnauthorizedWishlistAccessException } from 'src/domain/exceptions/wishlist/unauthorized-wishlist-access.exception';

describe('MakePrivateUseCase', () => {
	let wishlistReader: any;
	let wishlistWriter: any;

	let useCase: MakePrivateUseCase;

	beforeEach(() => {
		wishlistReader = {
			findById: jest.fn(),
		};

		wishlistWriter = {
			save: jest.fn(),
		};

		useCase = new MakePrivateUseCase(wishlistReader, wishlistWriter);
	});

	it('debería hacer wishlist privada', async () => {
		const wishlist = Wishlist.create({
			userId: 'user-id',
			isPrivate: false,
		});

		wishlistReader.findById.mockResolvedValue(wishlist);

		const result = await useCase.execute({
			id: wishlist.id,
			userId: 'user-id',
		});

		expect(wishlist.isPrivate).toBe(true);

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

import { Wishlist } from 'src/domain/entities/wishlist/wishlist.entity';
import { DeleteWishlistUseCase } from './delete-wishlist.usecase';
import { WishlistShareNotFoundException } from 'src/domain/exceptions/wishlist/whislist-share-not-found.exception';
import { UnauthorizedWishlistAccessException } from 'src/domain/exceptions/wishlist/unauthorized-wishlist-access.exception';

describe('DeleteWishlistUseCase', () => {
	let wishlistReader: any;
	let wishlistWriter: any;

	let useCase: DeleteWishlistUseCase;

	beforeEach(() => {
		wishlistReader = {
			findById: jest.fn(),
		};

		wishlistWriter = {
			softDelete: jest.fn(),
			deleteAndPromoteCandidate: jest.fn(),
		};

		useCase = new DeleteWishlistUseCase(wishlistReader, wishlistWriter);
	});

	it('debería eliminar wishlist normal', async () => {
		const wishlist = Wishlist.create({
			userId: 'user-id',
		});

		wishlistReader.findById.mockResolvedValue(wishlist);

		const result = await useCase.execute({
			id: wishlist.id,
			userId: 'user-id',
		});

		expect(wishlistWriter.softDelete).toHaveBeenCalledWith(wishlist.id);

		expect(result).toEqual({
			success: true,
		});
	});

	it('debería eliminar wishlist default y promover otra', async () => {
		const wishlist = Wishlist.create({
			userId: 'user-id',
		});

		wishlist.markAsDefault();

		wishlistReader.findById.mockResolvedValue(wishlist);

		const result = await useCase.execute({
			id: wishlist.id,
			userId: 'user-id',
		});

		expect(wishlistWriter.deleteAndPromoteCandidate).toHaveBeenCalledWith(
			wishlist.id,
			wishlist.userId,
		);

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

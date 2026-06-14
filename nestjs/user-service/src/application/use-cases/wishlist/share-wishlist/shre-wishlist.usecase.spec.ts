import { Wishlist } from 'src/domain/entities/wishlist/wishlist.entity';
import { ShareWishlistUseCase } from './shre-wishlist.usecase';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';
import { UnauthorizedWishlistAccessException } from 'src/domain/exceptions/wishlist/unauthorized-wishlist-access.exception';
import { WishlistShareNotFoundException } from 'src/domain/exceptions/wishlist/whislist-share-not-found.exception';

describe('ShareWishlistUseCase', () => {
	let wishlistReader: any;
	let wishlistWriter: any;
	let userReader: any;

	let useCase: ShareWishlistUseCase;

	beforeEach(() => {
		wishlistReader = {
			findById: jest.fn(),
		};

		wishlistWriter = {
			save: jest.fn(),
		};

		userReader = {
			findById: jest.fn(),
		};

		useCase = new ShareWishlistUseCase(
			wishlistReader,
			wishlistWriter,
			userReader,
		);
	});

	it('debería compartir wishlist', async () => {
		const wishlist = Wishlist.create({
			userId: 'user-id',
		});

		wishlistReader.findById.mockResolvedValue(wishlist);

		userReader.findById.mockResolvedValue({
			id: 'friend-id',
		});

		const result = await useCase.execute({
			wishlistId: wishlist.id,
			userId: 'user-id',
			sharedWithUserId: 'friend-id',
		});

		expect(wishlist.shares).toHaveLength(1);

		expect(wishlistWriter.save).toHaveBeenCalledWith(wishlist);

		expect(result.success).toBe(true);
	});

	it('debería lanzar error si wishlist no existe', async () => {
		wishlistReader.findById.mockResolvedValue(null);

		await expect(
			useCase.execute({
				wishlistId: 'wishlist-id',
				userId: 'user-id',
				sharedWithUserId: 'friend-id',
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
				wishlistId: wishlist.id,
				userId: 'otro-user',
				sharedWithUserId: 'friend-id',
			}),
		).rejects.toThrow(UnauthorizedWishlistAccessException);
	});

	it('debería lanzar error si usuario a compartir no existe', async () => {
		const wishlist = Wishlist.create({
			userId: 'user-id',
		});

		wishlistReader.findById.mockResolvedValue(wishlist);

		userReader.findById.mockResolvedValue(null);

		await expect(
			useCase.execute({
				wishlistId: wishlist.id,
				userId: 'user-id',
				sharedWithUserId: 'friend-id',
			}),
		).rejects.toThrow(UserNotFoundException);
	});
});

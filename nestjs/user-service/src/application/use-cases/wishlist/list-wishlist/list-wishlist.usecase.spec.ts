import { Wishlist } from 'src/domain/entities/wishlist/wishlist.entity';
import { ListWishUseCase } from './list-wishlist.usecase';
import { WishlistShareNotFoundException } from 'src/domain/exceptions/wishlist/whislist-share-not-found.exception';

describe('ListWishUseCase', () => {
	let wishlistReader: any;

	let useCase: ListWishUseCase;

	beforeEach(() => {
		wishlistReader = {
			findAll: jest.fn(),
		};

		useCase = new ListWishUseCase(wishlistReader);
	});

	it('debería listar wishlists', async () => {
		const wishlist = Wishlist.create({
			userId: 'user-id',
			name: 'Favoritos',
		});

		wishlist.addItem('product-1');

		wishlist.shareWith('friend-id');

		wishlistReader.findAll.mockResolvedValue({
			data: [wishlist],
			nextCursor: null,
			prevCursor: null,
			hasMore: false,
		});

		const result = await useCase.execute({
			userId: 'user-id',
			query: {},
		});

		expect(result.data).toHaveLength(1);

		expect(result.data[0]).toEqual({
			id: wishlist.id,
			name: wishlist.name,
			isPrivate: wishlist.isPrivate,
			isDefault: wishlist.isDefault,
			itemsCount: 1,
			sharesCount: 1,
			createdAt: wishlist.createdAt,
			updatedAt: wishlist.updatedAt,
		});
	});

	it('debería lanzar error si no hay wishlists', async () => {
		wishlistReader.findAll.mockResolvedValue({
			data: [],
			nextCursor: null,
			prevCursor: null,
			hasMore: false,
		});

		await expect(
			useCase.execute({
				userId: 'user-id',
				query: {},
			}),
		).rejects.toThrow(WishlistShareNotFoundException);
	});
});

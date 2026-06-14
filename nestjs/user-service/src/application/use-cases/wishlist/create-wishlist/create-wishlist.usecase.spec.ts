import { Wishlist } from 'src/domain/entities/wishlist/wishlist.entity';
import { CreateWishlistUseCase } from './create-wishlist.usecase';

describe('CreateWishlistUseCase', () => {
	let wishlistWriter: any;
	let wishlistReader: any;

	let useCase: CreateWishlistUseCase;

	beforeEach(() => {
		wishlistWriter = {
			save: jest.fn(),
		};

		wishlistReader = {
			findByNormalizeName: jest.fn(),
			findDefaultByUserId: jest.fn(),
		};

		useCase = new CreateWishlistUseCase(wishlistWriter, wishlistReader);
	});

	it('debería crear wishlist', async () => {
		wishlistReader.findByNormalizeName.mockResolvedValue(null);

		wishlistReader.findDefaultByUserId.mockResolvedValue(null);

		const result = await useCase.execute({
			userId: 'user-id',
			name: 'Favoritos',
			isPrivate: true,
		});

		expect(wishlistWriter.save).toHaveBeenCalled();

		expect(result.name).toBe('Favoritos');

		expect(result.isDefault).toBe(true);
	});

	it('debería retornar wishlist existente', async () => {
		const existingWishlist = Wishlist.create({
			userId: 'user-id',
			name: 'Favoritos',
		});

		wishlistReader.findByNormalizeName.mockResolvedValue(existingWishlist);

		const result = await useCase.execute({
			userId: 'user-id',
			name: 'Favoritos',
			isPrivate: true,
		});

		expect(result.alreadyExists).toBe(true);

		expect(wishlistWriter.save).not.toHaveBeenCalled();
	});

	it('debería crear wishlist no default si ya existe una default', async () => {
		const defaultWishlist = Wishlist.create({
			userId: 'user-id',
		});

		defaultWishlist.markAsDefault();

		wishlistReader.findByNormalizeName.mockResolvedValue(null);

		wishlistReader.findDefaultByUserId.mockResolvedValue(defaultWishlist);

		const result = await useCase.execute({
			userId: 'user-id',
			name: 'Nueva Lista',
			isPrivate: true,
		});

		expect(result.isDefault).toBe(false);
	});
});

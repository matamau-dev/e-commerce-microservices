import { Wishlist } from 'src/domain/entities/wishlist/wishlist.entity';
import { CursorQuery } from 'src/domain/pagination/cursor-query.interface';
import { CursorResult } from 'src/domain/pagination/cursor-result.interface';

export interface WishlistReader {
	findAll(
		userId: string,
		query: CursorQuery,
	): Promise<CursorResult<Wishlist>>;
	findById(id: string, userId: string): Promise<Wishlist | null>;
	findDefaultByUserId(userId: string): Promise<Wishlist | null>;
	findByNormalizeName(
		userId: string,
		normalizedName: string,
	): Promise<Wishlist | null>;
	findBestCandidate(
		userId: string,
		excludeId: string,
	): Promise<Wishlist | null>;
}

export interface WishlistWriter {
	save(wishlist: Wishlist): Promise<Wishlist>;
	removeItem(wishlistId: string, productId: string): Promise<void>;
	softDelete(id: string): Promise<void>;
	deleteAndPromoteCandidate(id: string, userId: string): Promise<void>;
}

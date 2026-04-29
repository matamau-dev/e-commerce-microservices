import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { Wishlist } from 'src/domain/entities/wishlist/wishlist.entity';
import { CursorQuery } from 'src/domain/pagination/cursor-query.interface';
import { CursorResult } from 'src/domain/pagination/cursor-result.interface';
import {
	WishlistReader,
	WishlistWriter,
} from 'src/domain/repositories/wishlist/wishlist.repository';
import { WishlistOrmEntity } from '../orm-entities/whislist/wishlist.orm-entity';
import { TypeormCursorPagination } from 'src/infrastructure/pagination/typeorm-cursor.pagination';
import { WishlistItem } from 'src/domain/entities/wishlist-item/wishlist-item.entity';
import { WishlistShare } from 'src/domain/entities/wishlist-share/whislist-share.entity';
import { WishlistItemOrmEntity } from '../orm-entities/whislist/wishlist-item.orm-entity';

export class WishlistPgRepository implements WishlistReader, WishlistWriter {
	constructor(
		@InjectRepository(WishlistOrmEntity)
		private readonly orm: Repository<WishlistOrmEntity>,
		@InjectRepository(WishlistItemOrmEntity)
		private readonly itemOrm: Repository<WishlistItemOrmEntity>,
		private readonly dataSource: DataSource,
		private readonly pagination: TypeormCursorPagination,
	) {}

	async findAll(
		userId: string,
		query: CursorQuery,
	): Promise<CursorResult<Wishlist>> {
		// const qb = this.orm
		// 	.createQueryBuilder('wishlist')
		// 	.leftJoin('wishlist.items', 'item')
		// 	.leftJoin('wishlist.shares', 'share')
		// 	.where('wishlist.userId = :userId', { userId })
		// 	.andWhere('wishlist.deleted_at IS NULL')
		// 	.select([
		// 		'wishlist.id AS id',
		// 		'wishlist.name AS name',
		// 		'wishlist.isPrivate AS "isPrivate"',
		// 		'wishlist.isDefault AS "isDefault"',
		// 		'wishlist.created_at AS "createdAt"',
		// 	])
		// 	.addSelect('COUNT(DISTINCT item.id)', 'itemsCount')
		// 	.addSelect('COUNT(DISTINCT share.id)', 'sharesCount')
		// 	.groupBy('wishlist.id')
		// 	.addGroupBy('wishlist.name')
		// 	.addGroupBy('wishlist.isPrivate')
		// 	.addGroupBy('wishlist.isDefault')
		// 	.addGroupBy('wishlist.created_at')
		// 	.orderBy('wishlist.created_at', 'DESC');
		const qb = this.orm
			.createQueryBuilder('wishlist')
			.leftJoin('wishlist.items', 'item')
			.leftJoin('wishlist.shares', 'share')
			.where('wishlist.userId = :userId', { userId })
			.andWhere('wishlist.deleted_at IS NULL')
			.loadRelationCountAndMap('wishlist.itemsCount', 'wishlist.items')
			.loadRelationCountAndMap('wishlist.sharesCount', 'wishlist.shares')
			.orderBy('wishlist.created_at', 'DESC');

		const result = await this.pagination.paginate(
			qb,
			query,
			'wishlist',
			'created_at',
		);
		return { ...result, data: result.data.map((w) => this.toDomain(w)) };
	}

	async findById(id: string, userId: string): Promise<Wishlist | null> {
		const found = await this.orm.findOne({
			where: { id, userId },
			relations: {
				items: true,
				shares: true,
			},
		});
		return found ? this.toDomain(found) : null;
	}

	async findByNormalizeName(
		userId: string,
		normalizedName: string,
	): Promise<Wishlist | null> {
		const found = await this.orm.findOne({
			where: { normalizedName, userId },
		});
		return found ? this.toDomain(found) : null;
	}

	async findDefaultByUserId(userId: string): Promise<Wishlist | null> {
		const found = await this.orm.findOne({
			where: { userId, isDefault: true },
			relations: { items: true, shares: true },
		});

		return found ? this.toDomain(found) : null;
	}

	async findBestCandidate(
		userId: string,
		excludeId: string,
	): Promise<Wishlist | null> {
		const found = await this.orm.findOne({
			where: {
				userId,
				id: Not(excludeId),
				deleted_at: IsNull(),
			},
			order: { updated_at: 'DESC' },
		});

		return found ? this.toDomain(found) : null;
	}

	async save(wishlist: Wishlist): Promise<Wishlist> {
		const saved = await this.orm.save(this.toOrm(wishlist));

		return this.toDomain(saved);
	}

	async deleteAndPromoteCandidate(id: string, userId: string): Promise<void> {
		await this.dataSource.transaction(async (manager) => {
			await manager.query(
				`
			UPDATE wishlists
			SET is_default = false,
				updated_at = NOW()
			WHERE id = $1
			`,
				[id],
			);

			await manager.softDelete(WishlistOrmEntity, id);

			await manager.query(
				`
			UPDATE wishlists
			SET is_default = true,
				updated_at = NOW()
			WHERE id = (
				SELECT id
				FROM wishlists
				WHERE user_id = $1
					AND id != $2
					AND deleted_at IS NULL
				ORDER BY updated_at DESC
				LIMIT 1
				)
			`,
				[userId, id],
			);
		});
	}

	async softDelete(id: string): Promise<void> {
		await this.orm.softDelete(id);
	}

	async removeItem(wishlistId: string, productId: string): Promise<void> {
		await this.itemOrm.delete({
			wishlistId,
			productId,
		});
	}

	private toDomain(orm: WishlistOrmEntity): Wishlist {
		return Wishlist.fromPersistence({
			id: orm.id,
			name: orm.name,
			isPrivate: orm.isPrivate,
			isDefault: orm.isDefault,
			userId: orm.userId,
			items:
				orm.items?.map((item) =>
					WishlistItem.fromPersistence({
						id: item.id,
						wishlistId: item.wishlistId,
						productId: item.productId,
						createdAt: item.createdAt,
					}),
				) ?? [],
			shares:
				orm.shares?.map((share) =>
					WishlistShare.fromPersistence({
						id: share.id,
						wishlistId: share.wishlistId,
						sharedWithUserId: share.sharedWithUserId,
						createdAt: share.createdAt,
					}),
				) ?? [],
			createdAt: orm.created_at,
			updatedAt: orm.updated_at,
		});
	}

	private toOrm(wishlist: Wishlist): Partial<WishlistOrmEntity> {
		return {
			id: wishlist.id,
			userId: wishlist.userId,
			name: wishlist.name,
			normalizedName: wishlist.normalizeName,
			isPrivate: wishlist.isPrivate,
			isDefault: wishlist.isDefault,
			created_at: wishlist.createdAt,
			updated_at: wishlist.updatedAt,

			items: wishlist.items.map((item) => ({
				id: item.id,
				wishlistId: item.wishlistId,
				productId: item.productId,
				createdAt: item.createdAt,
			})),

			shares: wishlist.shares.map((share) => ({
				id: share.id,
				wishlistId: share.wishlistId,
				sharedWithUserId: share.sharedWithUserId,
				createdAt: share.createdAt,
			})),
		};
	}
}

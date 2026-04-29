import {
	Entity,
	PrimaryColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
	Index,
	JoinColumn,
} from 'typeorm';
import { WishlistOrmEntity } from './wishlist.orm-entity';

@Entity('wishlist_items')
@Index('IDX_wishlist_items_wishlist_id', ['wishlistId'])
@Index('IDX_wishlist_items_product_id', ['productId'])
@Index(
	'UQ_wishlist_items_wishlist_id_product_id',
	['wishlistId', 'productId'],
	{ unique: true },
)
export class WishlistItemOrmEntity {
	@PrimaryColumn('uuid')
	id!: string;

	@Column({ type: 'uuid', name: 'wishlist_id' })
	wishlistId!: string;

	@Column({ type: 'uuid', name: 'product_id' })
	productId!: string;

	@ManyToOne(() => WishlistOrmEntity, (wishlist) => wishlist.items, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'wishlist_id' })
	wishlist?: WishlistOrmEntity;

	@CreateDateColumn()
	createdAt!: Date;
}

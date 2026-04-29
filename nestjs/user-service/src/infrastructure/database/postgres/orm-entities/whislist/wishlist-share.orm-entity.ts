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
import { UserOrmEntity } from '../user.orm-entity';

@Entity('wishlist_shares')
@Index('IDX_wishlist_shared_id', ['wishlistId'])
@Index('IDX_wishlist_shared_with_user_id', ['sharedWithUserId'])
@Index(
	'UQ_wishlist_id_shared_with_user_id',
	['wishlistId', 'sharedWithUserId'],
	{ unique: true },
)
export class WishlistShareOrmEntity {
	@PrimaryColumn('uuid')
	id!: string;

	@Column({ type: 'uuid', name: 'wishlist_id' })
	wishlistId!: string;

	@Column({ type: 'uuid', name: 'shared_with_user_id' })
	sharedWithUserId!: string;

	@ManyToOne(() => UserOrmEntity, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'shared_with_user_id' })
	sharedWithUser?: UserOrmEntity;

	@ManyToOne(() => WishlistOrmEntity, (wishlist) => wishlist.shares, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'wishlist_id' })
	wishlist?: WishlistOrmEntity;

	@CreateDateColumn()
	createdAt!: Date;
}

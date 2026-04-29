import {
	Entity,
	PrimaryColumn,
	Column,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
	Index,
	DeleteDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { WishlistItemOrmEntity } from './wishlist-item.orm-entity';
import { WishlistShareOrmEntity } from './wishlist-share.orm-entity';
import { UserOrmEntity } from '../user.orm-entity';

@Entity('wishlists')
@Index('IDX_wishlists_user_id', ['userId'])
@Index('IDX_wishlists_is_default', ['isDefault'])
@Index('IDX_wishlists_created_at', ['created_at'])
@Index('UQ_wishlists_user_normalized_name', ['userId', 'normalizedName'], {
	unique: true,
})
export class WishlistOrmEntity {
	@PrimaryColumn('uuid')
	id!: string;

	@Column({ type: 'uuid', name: 'user_id' })
	userId!: string;

	@Column({ default: true, name: 'is_private' })
	isPrivate!: boolean;

	@Column({ nullable: true, default: 'My wishlist' })
	name?: string;

	@Column({ nullable: true, default: 'my wishlist' })
	normalizedName?: string;

	@Column({ default: false, name: 'is_default' })
	isDefault!: boolean;

	@ManyToOne(() => UserOrmEntity)
	@JoinColumn({ name: 'user_id' })
	user!: UserOrmEntity;

	@OneToMany(() => WishlistItemOrmEntity, (item) => item.wishlist, {
		cascade: true,
	})
	items!: WishlistItemOrmEntity[];

	@OneToMany(() => WishlistShareOrmEntity, (share) => share.wishlist, {
		cascade: true,
	})
	shares!: WishlistShareOrmEntity[];

	@CreateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
		select: true,
	})
	created_at!: Date;

	@UpdateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
		select: false,
	})
	updated_at!: Date;

	@DeleteDateColumn({ type: 'timestamp', nullable: true, select: false })
	deleted_at?: Date;
}

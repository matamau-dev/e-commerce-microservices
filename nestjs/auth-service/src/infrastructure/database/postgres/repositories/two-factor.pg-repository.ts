import { InjectRepository } from '@nestjs/typeorm';
import {
	TwoFactorReader,
	TwoFactorWriter,
} from 'src/domain/repositories/two-factor.repository';
import { TwoFactorOrmEntity } from '../orm-entities/two-factor.orm-entity';
import { Repository } from 'typeorm';
import { TwoFactor } from 'src/domain/entities/two-factor.entity';

// repositories/two-factor.pg-repository.ts
export class TwoFactorPgRepository implements TwoFactorReader, TwoFactorWriter {
	constructor(
		@InjectRepository(TwoFactorOrmEntity)
		private readonly orm: Repository<TwoFactorOrmEntity>,
	) {}

	async findByUserId(userId: string): Promise<TwoFactor | null> {
		const found = await this.orm.findOne({ where: { userId } });
		return found ? this.toDomain(found) : null;
	}

	async save(twoFactor: TwoFactor): Promise<TwoFactor> {
		const saved = await this.orm.save(this.toOrm(twoFactor));
		return this.toDomain(saved);
	}

	async update(twoFactor: TwoFactor): Promise<TwoFactor> {
		const saved = await this.orm.save(this.toOrm(twoFactor));
		return this.toDomain(saved);
	}

	private toDomain(orm: TwoFactorOrmEntity): TwoFactor {
		const tf = new TwoFactor();
		tf.id = orm.id;
		tf.userId = orm.userId;
		tf.secret = orm.secret;
		tf.isEnabled = orm.isEnabled;
		tf.verifiedAt = orm.verifiedAt;
		tf.createdAt = orm.createdAt;
		return tf;
	}

	private toOrm(tf: TwoFactor): Partial<TwoFactorOrmEntity> {
		return {
			id: tf.id,
			userId: tf.userId,
			secret: tf.secret,
			isEnabled: tf.isEnabled,
			verifiedAt: tf.verifiedAt,
		};
	}
}

import { TwoFactor } from '../entities/two-factor.entity';

export interface TwoFactorReader {
	findByUserId(userId: string): Promise<TwoFactor | null>;
}

export interface TwoFactorWriter {
	save(twoFactor: TwoFactor): Promise<TwoFactor>;
	update(twoFactor: TwoFactor): Promise<TwoFactor>;
}

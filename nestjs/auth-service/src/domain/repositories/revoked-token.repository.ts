import { RevokedToken } from '../entities/revoked-token.entity';

export interface RevokedTokenReader {
	existsByToken(token: string): Promise<boolean>;
}

export interface RevokedTokenWriter {
	create(revokedToken: RevokedToken): Promise<void>;
	deleteExpired(): Promise<void>; // limpieza periódica
}

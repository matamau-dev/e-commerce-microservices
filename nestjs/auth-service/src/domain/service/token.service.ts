import { RoleEnum } from '../enums/role.enum';

export interface TokenService {
	generateAccessToken(payload: { userId: string; role: RoleEnum }): string;

	generateRefreshToken(): string;

	verifyAccessToken(token: string): {
		userId: string;
		role: RoleEnum;
	};
}

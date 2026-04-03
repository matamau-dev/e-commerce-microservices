import { RoleEnum } from 'src/domain/enums/role.enum';

export interface LoginOutput {
	accessToken: string;
	refreshToken: string;
	requiresTwoFactor: boolean; // si tiene 2FA activo
	user: {
		id: string;
		role: RoleEnum;
	};
}

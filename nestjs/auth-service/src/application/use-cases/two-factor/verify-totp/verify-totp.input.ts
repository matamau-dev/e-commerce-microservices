import { RoleEnum } from 'src/domain/enums/role.enum';

export interface VerifyTotpInput {
	userId: string;
	code: string; // el código de 6 dígitos de Google Authenticator
	isLoginVerification: boolean; // true = viene del login, false = está activando 2FA
	role?: RoleEnum; // necesario si viene del login para generar el JWT
}

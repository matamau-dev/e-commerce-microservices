import { RoleEnum } from '../enums/role.enum';

export class Session {
	id: string;
	userId: string;
	role: RoleEnum;
	refreshToken: string; // hasheado con argon2
	deviceInfo: string;
	ipAddress: string;
	expiresAt: Date;
	createdAt: Date;
}

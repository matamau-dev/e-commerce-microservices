export class TwoFactor {
	id: string;
	userId: string;
	secret: string; // secreto TOTP encriptado con AES
	isEnabled: boolean;
	verifiedAt?: Date;
	createdAt: Date;
}

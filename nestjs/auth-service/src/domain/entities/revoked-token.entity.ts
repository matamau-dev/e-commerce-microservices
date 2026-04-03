export class RevokedToken {
	id: string;
	userId: string;
	token: string; // access token hasheado
	expiresAt: Date; // para limpieza automática
	createdAt: Date;
}

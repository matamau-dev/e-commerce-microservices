export interface LogoutInput {
	userId: string;
	refreshToken: string;
	accessToken: string; // para revocarlo también
	allDevices?: boolean;
}

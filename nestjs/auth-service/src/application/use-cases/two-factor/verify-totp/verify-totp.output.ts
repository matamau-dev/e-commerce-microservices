export interface VerifyTotpOutput {
	verified: boolean;
	accessToken?: string; // solo si viene del login
	refreshToken?: string;
}

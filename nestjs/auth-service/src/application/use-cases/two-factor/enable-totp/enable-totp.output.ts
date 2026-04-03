export interface EnableTotpOutput {
	secret: string; // el usuario lo escanea en Google Authenticator
	qrCodeUrl: string; // URL para generar el QR
}

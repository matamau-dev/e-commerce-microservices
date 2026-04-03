import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class TotpService {
	constructor(private readonly configService: ConfigService) {}

	generateSecret(userId: string): { secret: string; qrCodeUrl: string } {
		const generated = speakeasy.generateSecret({
			name: `${this.configService.get('totp.appName')}:${userId}`,
			length: 32,
		});

		const qrCodeUrl = speakeasy.otpauthURL({
			secret: generated.base32,
			label: userId,
			issuer: this.configService.get('totp.appName'),
			encoding: 'base32',
		});

		return {
			secret: generated.base32,
			qrCodeUrl,
		};
	}

	verify(code: string, secret: string): boolean {
		return speakeasy.totp.verify({
			secret,
			encoding: 'base32',
			token: code,
			window: 1, // permite 1 intervalo de tolerancia (30 segundos)
		});
	}
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

@Injectable()
export class LocalStorageService {
	constructor(private readonly configService: ConfigService) {}

	getStaticImage(fileName: string, folder: string): string {
		return path.join(process.cwd(), 'uploads', folder, fileName);
	}

	getPublicUrl(fileName: string, folder: string): string {
		const baseUrl = this.configService.get('image.url');
		return `${baseUrl}/api/v1/users/profile-image/${folder}/${fileName}`;
	}
}

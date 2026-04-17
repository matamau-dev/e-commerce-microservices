import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class LocalStorageService {
	constructor(private readonly configService: ConfigService) {}

	getStaticImage(fileName: string, folder: string): string {
		return path.join(process.cwd(), 'uploads', folder, fileName);
	}

	getPublicUrl(fileName: string, folder: string): string {
		const baseUrl = this.configService.get('image.profile');
		return `${baseUrl}/${folder}/${fileName}`;
	}

	async deleteFile(fileName: string, folder: string): Promise<void> {
		const filePath = path.join(process.cwd(), 'uploads', folder, fileName);

		try {
			await fs.unlink(filePath);
		} catch (error) {
			console.error('Error al eliminar archivo:', error);
		}
	}
}

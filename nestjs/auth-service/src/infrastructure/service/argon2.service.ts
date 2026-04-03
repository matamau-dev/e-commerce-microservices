import { Injectable } from '@nestjs/common';
import { HashService } from 'src/domain/service/hash.service';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

@Injectable()
export class Argon2Service implements HashService {
	constructor(private readonly configService: ConfigService) {}
	async hash(plain: string): Promise<string> {
		const type = this.configService.get<number>('argon2.type');

		if (type !== 0 && type !== 1 && type !== 2) {
			throw new Error('Invalid argon2 type');
		}
		return argon2.hash(plain, {
			type,
			memoryCost: this.configService.get<number>('argon2.memoryCost'),
			timeCost: this.configService.get<number>('argon2.timeCost'),
			parallelism: this.configService.get<number>('argon2.parallelism'),
		});
	}

	async compare(plain: string, hashed: string): Promise<boolean> {
		return argon2.verify(hashed, plain);
	}
}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Module({
	imports: [
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				const jwt = configService.getOrThrow('jwt');

				return {
					privateKey: fs.readFileSync(
						path.resolve(jwt.privateKeyPath),
						'utf8',
					),
					publicKey: fs.readFileSync(
						path.resolve(jwt.publicKeyPath),
						'utf8',
					),
					signOptions: {
						algorithm: 'RS256',
						expiresIn: jwt.expiresIn,
					},
				};
			},
		}),
	],
	exports: [JwtModule],
})
export class JwtRs256Module {}

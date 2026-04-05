import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as fs from 'fs';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as path from 'path';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: fs.readFileSync(
				path.resolve(configService.getOrThrow('jwt.publicKeyPath')),
				'utf8',
			),
			algorithms: ['RS256'],
		});
	}

	async validate(payload: { sub: string; role: string }) {
		// Solo extrae los datos del token — ya fue verificado arriba
		return { id: payload.sub, role: payload.role };
	}
}

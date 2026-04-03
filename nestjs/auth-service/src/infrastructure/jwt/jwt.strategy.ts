import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { Inject } from '@nestjs/common';
import type { RevokedTokenReader } from 'src/domain/repositories/revoked-token.repository';
import type { HashService } from 'src/domain/service/hash.service';
import { RoleEnum } from 'src/domain/enums/role.enum';
import { TokenRevokedException } from 'src/domain/exceptions/token-revoked.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		configService: ConfigService,
		@Inject('RevokedTokenReader')
		private readonly revokedTokenReader: RevokedTokenReader,
		@Inject('HashService')
		private readonly hashService: HashService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: fs.readFileSync(
				path.resolve(configService.getOrThrow('jwt.publicKeyPath')),
				'utf8',
			),
			algorithms: ['RS256'],
			passReqToCallback: true, // necesitamos el request para verificar revocación
		});
	}

	async validate(req: Request, payload: { sub: string; role: RoleEnum }) {
		// Extrae el token del header para verificar si fue revocado
		const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req as any);
		if (!token) {
			throw new TokenRevokedException(); // o algún TokenMissingException
		}
		// Verifica si el token fue revocado — logout anticipado
		const isRevoked = await this.revokedTokenReader.existsByToken(token);
		if (isRevoked) throw new TokenRevokedException();

		return { id: payload.sub, role: payload.role };
	}
}

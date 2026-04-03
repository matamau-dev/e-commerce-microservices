import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { RoleEnum } from 'src/domain/enums/role.enum';
import { TokenService } from 'src/domain/service/token.service';
import { TokenExpiredException } from 'src/domain/exceptions/token-expired.exception';

@Injectable()
export class JwtRs256Service implements TokenService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	generateAccessToken(payload: { userId: string; role: RoleEnum }): string {
		return this.jwtService.sign({
			sub: payload.userId,
			role: payload.role,
		});
	}

	generateRefreshToken(): string {
		return crypto.randomUUID() + '-' + crypto.randomUUID();
	}

	verifyAccessToken(token: string): { userId: string; role: RoleEnum } {
		try {
			const payload = this.jwtService.verify<{
				sub: string;
				role: RoleEnum;
			}>(token);

			return {
				userId: payload.sub,
				role: payload.role,
			};
		} catch {
			throw new TokenExpiredException();
		}
	}
}

import {
	SessionReader,
	SessionWriter,
} from 'src/domain/repositories/session.repository';
import { HashService } from 'src/domain/service/hash.service';
import { TokenService } from 'src/domain/service/token.service';
import { RefreshTokenInput } from './refresh-token.input';
import { RefreshTokenOutput } from './refresh-token.output';
import { SessionNotFoundException } from 'src/domain/exceptions/session-not-found.exception';
import { Session } from 'src/domain/entities/session.entity';
import { TokenExpiredException } from 'src/domain/exceptions/token-expired.exception';

export class RefreshTokenUseCase {
	constructor(
		private readonly sessionReader: SessionReader,
		private readonly sessionWriter: SessionWriter,
		private readonly tokenService: TokenService,
		private readonly hashService: HashService,
	) {}

	async execute(input: RefreshTokenInput): Promise<RefreshTokenOutput> {
		const sessions = await this.sessionReader.findAllByUserId(input.userId);
		if (!sessions.length) throw new SessionNotFoundException();

		// Encuentra la sesión que corresponde al refresh token
		let matched: Session | null = null;
		for (const session of sessions) {
			const valid = await this.hashService.compare(
				input.refreshToken,
				session.refreshToken,
			);
			if (valid) {
				matched = session;
				break;
			}
		}

		if (!matched) throw new SessionNotFoundException();
		if (new Date() > matched.expiresAt) {
			await this.sessionWriter.delete(matched.id);
			throw new TokenExpiredException();
		}

		const newAccessToken = this.tokenService.generateAccessToken({
			userId: matched.userId,
			role: matched.role,
		});
		const newRefreshToken = this.tokenService.generateRefreshToken();

		await this.sessionWriter.delete(matched.id);
		await this.sessionWriter.create({
			...matched,
			id: crypto.randomUUID(),
			refreshToken: await this.hashService.hash(newRefreshToken),
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			createdAt: new Date(),
		});

		return {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		};
	}
}

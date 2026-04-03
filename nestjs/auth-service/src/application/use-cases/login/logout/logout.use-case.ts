import { RevokedTokenWriter } from 'src/domain/repositories/revoked-token.repository';
import {
	SessionReader,
	SessionWriter,
} from 'src/domain/repositories/session.repository';
import { HashService } from 'src/domain/service/hash.service';
import { LogoutInput } from './logout.input';
import { LogoutOutput } from './logout.output';
import { Session } from 'src/domain/entities/session.entity';

export class LogoutUseCase {
	constructor(
		private readonly sessionReader: SessionReader,
		private readonly sessionWriter: SessionWriter,
		private readonly revokedTokenWriter: RevokedTokenWriter,
		private readonly hashService: HashService,
	) {}

	async execute(input: LogoutInput): Promise<LogoutOutput> {
		// Revoca el access token — no puede usarse aunque no haya expirado
		await this.revokedTokenWriter.create({
			id: crypto.randomUUID(),
			userId: input.userId,
			token: await this.hashService.hash(input.accessToken),
			expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min = vida del access token
			createdAt: new Date(),
		});

		if (input.allDevices) {
			await this.sessionWriter.deleteAllByUserId(input.userId);
			return { message: 'Sesión cerrada en todos los dispositivos' };
		}

		const sessions = await this.sessionReader.findAllByUserId(input.userId);
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

		if (matched) await this.sessionWriter.delete(matched.id);

		return { message: 'Sesión cerrada correctamente' };
	}
}

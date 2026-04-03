import { Session } from '../entities/session.entity';

export interface SessionReader {
	findAllByUserId(userId: string): Promise<Session[]>;
}

export interface SessionWriter {
	create(session: Session): Promise<Session>;
	delete(id: string): Promise<void>;
	deleteAllByUserId(userId: string): Promise<void>;
}

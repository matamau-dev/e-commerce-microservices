import { LoginAttempt } from '../entities/login-attempt.entity';

export interface LoginAttemptWriter {
	create(attempt: LoginAttempt): Promise<void>;
}

export interface LoginAttemptReader {
	countRecentFailedByEmail(
		email: string,
		sinceMinutes: number,
	): Promise<number>;
}

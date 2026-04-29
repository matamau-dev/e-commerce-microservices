import { Email } from '../value-objects/email_or_user_name.value-object';

export class LoginAttempt {
	id!: string;
	userId?: string;
	email!: Email;
	success!: boolean;
	ipAddress!: string;
	deviceInfo!: string;
	createdAt!: Date;
}

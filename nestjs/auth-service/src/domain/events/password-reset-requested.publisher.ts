export interface PasswordResetRequestedEvent {
	userId: string;
	email: string;
	resetToken: string;
	expiresAt: Date;
}

export interface PasswordResetRequestedPublisher {
	publish(event: PasswordResetRequestedEvent): Promise<void>;
}

import { DomainException } from './domain.exception';

export class InvalidResetTokenException extends DomainException {
	constructor() {
		super('Token de recuperación inválido o expirado');
	}
}

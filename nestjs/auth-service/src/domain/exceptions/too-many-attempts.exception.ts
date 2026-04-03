import { DomainException } from './domain.exception';

export class TooManyAttemptsException extends DomainException {
	constructor() {
		super('Demasiados intentos fallidos, intenta más tarde');
	}
}

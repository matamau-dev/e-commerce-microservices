import { DomainException } from './domain.exception';

export class InvalidTotpException extends DomainException {
	constructor() {
		super('Código 2FA inválido');
	}
}

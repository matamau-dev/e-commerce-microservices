import { DomainException } from './domain.exception';

export class AccountInactiveException extends DomainException {
	constructor() {
		super('Cuenta inactiva');
	}
}

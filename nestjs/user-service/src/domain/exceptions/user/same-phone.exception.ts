import { DomainException } from '../domain.exception';

export class SamePhoneException extends DomainException {
	constructor() {
		super('El telefono no puede ser igual al actual.');
	}
}

import { DomainException } from '../domain.exception';

export class CannotDeleteDefaultAddressException extends DomainException {
	constructor() {
		super('No puede eliminar su única dirección');
	}
}

import { DomainException } from '../domain.exception';

export class AddressNotOwnedByUserException extends DomainException {
	constructor() {
		super(`Dirección no pertenece al usuario`);
	}
}

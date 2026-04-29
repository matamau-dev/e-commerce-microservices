import { DomainException } from '../domain.exception';

export class AddressNotFoundException extends DomainException {
	constructor() {
		super(`La dirección que busca no existe`);
	}
}

import { DomainException } from '../domain.exception';

export class PhoneAlreadyExistsException extends DomainException {
	constructor(phone: string) {
		super(`El número de teléfono ${phone} ya existe.`);
	}
}

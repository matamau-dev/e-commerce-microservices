import { DomainException } from '../domain.exception';

export class EmailAlreadyExistsException extends DomainException {
	constructor(email: string) {
		super(`El correo ${email} ya esta en uso.`);
	}
}

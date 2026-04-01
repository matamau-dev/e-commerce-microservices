import { DomainException } from '../domain.exception';

export class EmailAlreadyExistsException extends DomainException {
	constructor(email: string) {
		super(`The email ${email} already exists.`);
	}
}

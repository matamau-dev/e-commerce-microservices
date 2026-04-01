import { DomainException } from '../domain.exception';

export class InvalidPasswordException extends DomainException {
	constructor() {
		super('The provided password is incorrect.');
	}
}

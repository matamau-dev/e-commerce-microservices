import { DomainException } from '../domain.exception';

export class UserListEmptyException extends DomainException {
	constructor() {
		super('The user list is empty.');
	}
}

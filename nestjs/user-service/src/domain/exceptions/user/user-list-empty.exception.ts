import { DomainException } from '../domain.exception';

export class UserListEmptyException extends DomainException {
	constructor() {
		super('La lista de usuarios está vacía.');
	}
}

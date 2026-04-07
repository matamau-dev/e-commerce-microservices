import { DomainException } from '../domain.exception';

export class UserNotFoundException extends DomainException {
	constructor(userId: string) {
		super(`Usuario con ID ${userId} no encontrado.`);
	}
}

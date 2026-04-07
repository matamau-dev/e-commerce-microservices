import { DomainException } from '../domain.exception';

export class InvalidPasswordException extends DomainException {
	constructor() {
		super('La contraseña proporcionada es incorrecta.');
	}
}

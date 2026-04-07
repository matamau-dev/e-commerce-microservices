import { DomainException } from '../domain.exception';

export class SamePasswordException extends DomainException {
	constructor() {
		super('La nueva contraseña no puede ser igual a la contraseña actual.');
	}
}

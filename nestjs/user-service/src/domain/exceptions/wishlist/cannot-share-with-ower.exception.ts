import { DomainException } from '../domain.exception';

export class CannotShareWithOwnerException extends DomainException {
	constructor() {
		super('No se puede compartir con el mismo dueño');
	}
}

import { DomainException } from './domain.exception';
export class SessionNotFoundException extends DomainException {
	constructor() {
		super('Session no encontrada o expirada.');
	}
}

import { DomainException } from './domain.exception';

export class TokenExpiredException extends DomainException {
	constructor() {
		super('Token expirado');
	}
}

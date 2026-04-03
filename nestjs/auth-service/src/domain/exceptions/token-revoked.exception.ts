import { DomainException } from './domain.exception';

export class TokenRevokedException extends DomainException {
	constructor() {
		super('Token revocado');
	}
}

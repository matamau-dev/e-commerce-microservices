import { DomainException } from '../domain.exception';

export class UnauthorizedWishlistAccessException extends DomainException {
	constructor() {
		super('No eres el propietario ');
	}
}

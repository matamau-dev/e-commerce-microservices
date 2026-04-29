import { DomainException } from '../domain.exception';

export class WishlistAlreadySharedException extends DomainException {
	constructor() {
		super('La wishlist ya fue compartida con este usuario');
	}
}

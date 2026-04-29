import { DomainException } from '../domain.exception';

export class WishlistShareNotFoundException extends DomainException {
	constructor() {
		super('Wishlist no encontrada');
	}
}

import { DomainException } from '../domain.exception';

export class ProductAlreadyInWishlistException extends DomainException {
	constructor() {
		super('El producto ya está en la wishlist');
	}
}

import { DomainException } from '../domain.exception';

export class ProductNotInWishlistException extends DomainException {
	constructor() {
		super('El producto no está en la wishlist');
	}
}

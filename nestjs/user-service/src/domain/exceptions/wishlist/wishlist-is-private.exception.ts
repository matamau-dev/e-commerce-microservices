import { DomainException } from '../domain.exception';

export class WishlistIsPrivateException extends DomainException {
	constructor() {
		super('No se puede compartir una wishlist privada');
	}
}

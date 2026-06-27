import { DomainException } from '../domain.exception';

export class ProductLineNotFoundException extends DomainException {
	constructor() {
		super('Product line Not Found');
	}
}

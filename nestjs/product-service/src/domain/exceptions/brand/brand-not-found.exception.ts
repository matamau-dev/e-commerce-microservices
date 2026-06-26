import { DomainException } from '../domain.exception';

export class BrandNotFoundException extends DomainException {
	constructor() {
		super(`Brand with id not found`);
	}
}

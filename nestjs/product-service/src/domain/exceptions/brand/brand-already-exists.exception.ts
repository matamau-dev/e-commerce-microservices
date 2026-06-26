import { DomainException } from '../domain.exception';

export class BrandWithThisNameAlreadyExistsException extends DomainException {
	constructor() {
		super('Brand with name already exists.');
	}
}

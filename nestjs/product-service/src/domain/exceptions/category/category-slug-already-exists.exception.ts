import { DomainException } from '../domain.exception';

export class CategorySlugAlreadyExistsException extends DomainException {
	constructor() {
		super('The slug is already in use.');
	}
}

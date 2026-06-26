import { DomainException } from '../domain.exception';

export class CategoryHasChildrenException extends DomainException {
	constructor() {
		super('Category cant deleted, its has children.');
	}
}

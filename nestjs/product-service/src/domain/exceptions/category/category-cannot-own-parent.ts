import { DomainException } from '../domain.exception';

export class CategoryCannotOwnParent extends DomainException {
	constructor() {
		super('A category cannot be its own parent');
	}
}

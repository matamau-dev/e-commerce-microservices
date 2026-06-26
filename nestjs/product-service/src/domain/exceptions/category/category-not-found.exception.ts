import { DomainException } from '../domain.exception';

export class CategoryNotFoundException extends DomainException {
	constructor(id: string) {
		super(`Category with id  not found.`);
	}
}

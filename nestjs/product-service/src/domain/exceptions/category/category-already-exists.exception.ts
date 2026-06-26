import { DomainException } from '../domain.exception';

export class CategoryAlreadyExistsException extends DomainException {
	constructor(name: string) {
		super(`Category with name "${name}" already exists.`);
	}
}

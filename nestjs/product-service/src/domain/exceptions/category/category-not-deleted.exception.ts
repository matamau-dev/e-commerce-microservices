import { DomainException } from '../domain.exception';

export class CategoryNotDeletedException extends DomainException {
	constructor() {
		super(`category hasn't deleted`);
	}
}

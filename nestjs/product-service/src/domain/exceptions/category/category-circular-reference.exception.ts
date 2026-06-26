import { DomainException } from '../domain.exception';

export class CategoryCircularReferenceException extends DomainException {
	constructor() {
		super(
			'A category cannot be a parent of itself or any of its descendants',
		);
	}
}

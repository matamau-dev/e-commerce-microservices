import { DomainException } from '../domain.exception';

export class ParentNotFoundException extends DomainException {
	constructor(parentID: string) {
		super(`Parent category with id "${parentID}" not found.`);
	}
}

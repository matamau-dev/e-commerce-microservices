import { DomainException } from '../domain.exception';

export class InvalidSlugException extends DomainException {
	constructor(message: string) {
		super(`Invalid slug: ${message}`);
	}
}

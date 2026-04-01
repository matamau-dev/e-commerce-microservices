import { DomainException } from '../domain.exception';

export class SamePasswordException extends DomainException {
	constructor() {
		super('The new password cannot be the same as the current password.');
	}
}

import { DomainException } from '../domain.exception';

export class PhoneAlreadyExistsException extends DomainException {
	constructor(phone: string) {
		super(`The phone number ${phone} already exists.`);
	}
}

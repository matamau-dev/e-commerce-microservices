export class PhoneAlreadyExistsException extends Error {
	constructor(phone: string) {
		super(`The phone number ${phone} already exists.`);
	}
}

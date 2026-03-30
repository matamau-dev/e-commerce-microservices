export class InvalidPasswordException extends Error {
	constructor() {
		super('The provided password is incorrect.');
	}
}

export class SamePasswordException extends Error {
	constructor() {
		super('The new password cannot be the same as the current password.');
	}
}

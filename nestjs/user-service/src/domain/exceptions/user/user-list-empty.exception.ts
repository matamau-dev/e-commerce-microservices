export class UserListEmptyException extends Error {
	constructor() {
		super('The user list is empty.');
	}
}

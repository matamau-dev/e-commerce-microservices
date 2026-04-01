import { ValidationException } from '../exceptions/validation.exception';

export class UserName {
	private readonly value: string;

	constructor(userName: string) {
		if (!userName?.trim()) {
			throw new ValidationException('El nombre de usuario es requerido');
		}

		if (userName.length < 3 || userName.length > 20) {
			throw new ValidationException(
				'El nombre de usuario debe tener entre 3 y 20 caracteres',
			);
		}

		const userNameRegex = /^[a-zA-Z0-9_]+$/;
		if (!userNameRegex.test(userName)) {
			throw new ValidationException(
				'El nombre de usuario solo puede tener letras, números y _',
			);
		}

		this.value = userName.trim().toLowerCase();
	}

	getValue(): string {
		return this.value;
	}
}

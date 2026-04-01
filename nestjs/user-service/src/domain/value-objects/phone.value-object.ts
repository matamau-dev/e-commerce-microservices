import { ValidationException } from '../exceptions/validation.exception';

export class Phone {
	private readonly value: string;

	constructor(phone: string) {
		if (!phone?.trim()) {
			throw new ValidationException('El teléfono es requerido');
		}

		const phoneRegex = /^\d{10}$/;
		if (!phoneRegex.test(phone)) {
			throw new ValidationException('El teléfono debe tener 10 dígitos');
		}

		this.value = phone.trim();
	}

	getValue(): string {
		return this.value;
	}
}

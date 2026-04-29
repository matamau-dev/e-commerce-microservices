import { ValidationException } from 'src/domain/exceptions/validation.exception';

export class Email {
	private readonly value: string;

	constructor(email: string) {
		if (!email?.trim()) {
			throw new ValidationException('El email es requerido');
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			throw new ValidationException(`El email ${email} no es válido`);
		}

		this.value = email.toLowerCase().trim();
	}

	getValue(): string {
		return this.value;
	}

	equals(other: Email): boolean {
		return this.value === other.getValue();
	}
}

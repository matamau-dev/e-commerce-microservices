import { ValidationException } from 'src/domain/exceptions/validation.exception';

export class Email {
	private readonly email: string;

	constructor(email: string) {
		this.email = email;
	}

	static create(input: string): Email {
		const normalizedEmail = input?.trim().toLowerCase();

		if (!normalizedEmail) {
			throw new ValidationException('El email es requerido');
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(normalizedEmail)) {
			throw new ValidationException(`El email ${input} no es válido`);
		}

		return new Email(normalizedEmail);
	}

	getValue(): string {
		return this.email;
	}

	equals(other: Email): boolean {
		return this.email === other.getValue();
	}
}

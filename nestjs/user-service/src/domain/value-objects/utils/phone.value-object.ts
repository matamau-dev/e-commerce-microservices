export class PhoneNumber {
	private readonly value: string;

	constructor(value: string) {
		this.value = value;
	}

	static create(input: string): PhoneNumber {
		if (!input) {
			throw new Error('Phone number is required');
		}

		let normalized = input.replace(/\D/g, '');

		if (normalized.startsWith('52') && normalized.length === 12) {
			normalized = normalized.slice(2);
		}

		if (normalized.length !== 10) {
			throw new Error('Invalid Mexican phone number');
		}

		return new PhoneNumber(normalized);
	}

	getValue(): string {
		return this.value;
	}

	format(): string {
		return `${this.value.slice(0, 3)} ${this.value.slice(3, 6)} ${this.value.slice(6)}`;
	}

	equals(other: PhoneNumber): boolean {
		return this.value === other.value;
	}
}

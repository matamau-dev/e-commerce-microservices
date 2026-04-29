export class PostalCode {
	private readonly value: string;

	private constructor(value: string) {
		this.value = value;
	}

	static create(input: string): PostalCode {
		if (!input) {
			throw new Error('Postal code is required');
		}

		const normalized = input.trim();

		if (!/^\d{5}$/.test(normalized)) {
			throw new Error('Invalid Mexican postal code');
		}

		return new PostalCode(normalized);
	}

	getValue(): string {
		return this.value;
	}

	equals(other: PostalCode): boolean {
		return this.value === other.value;
	}
}

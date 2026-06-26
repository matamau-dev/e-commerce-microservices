import { Slug } from 'src/domain/value-objects/slug.value-object';

export class Brand {
	private constructor(
		public readonly id: string,
		public name: string,
		public readonly createdAt: Date,
		public updatedAt: Date,
		public slug: string,
		public readonly deletedAt?: Date,
	) {}

	static create(input: { name: string; slug: string }): Brand {
		return new Brand(
			crypto.randomUUID(),
			input.name,
			new Date(),
			new Date(),
			new Slug(input.slug).getValue(),
		);
	}

	static fromPersistence(input: {
		id: string;
		name: string;
		createdAt: Date;
		updatedAt: Date;
		slug: string;
	}): Brand {
		return new Brand(
			input.id,
			input.name,
			input.createdAt,
			input.updatedAt,
			input.slug,
		);
	}

	changeName(name: string) {
		this.touch();
		this.name = name;
	}

	changeSlug(slug: string) {
		this.touch();
		this.slug = new Slug(slug).getValue();
	}

	private touch() {
		this.updatedAt = new Date();
	}
}

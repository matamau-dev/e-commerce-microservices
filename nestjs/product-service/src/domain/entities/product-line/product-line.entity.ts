import { Slug } from 'src/domain/value-objects/slug.value-object';

export class ProductLine {
	private constructor(
		public readonly id: string,
		public name: string,
		public readonly createdAt: Date,
		public updatedAt: Date,
		public slug: string,
		public readonly deletedAt?: Date,
	) {}

	static create(input: { name: string; slug: string }): ProductLine {
		return new ProductLine(
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
	}): ProductLine {
		return new ProductLine(
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
		this.slug = slug;
	}

	private touch() {
		this.updatedAt = new Date();
	}
}

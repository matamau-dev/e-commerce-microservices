import { Slug } from 'src/domain/value-objects/slug.value-object';

export class Category {
	private constructor(
		public readonly id: string,
		public name: string,
		public readonly createdAt: Date,
		public updatedAt: Date,
		public parentID?: string,
		public slug?: string,
		public readonly deletedAt?: Date,
	) {}

	static create(input: {
		name: string;
		parentID?: string;
		slug?: string;
	}): Category {
		return new Category(
			crypto.randomUUID(),
			input.name,
			new Date(),
			new Date(),
			input.parentID,
			new Slug(input.slug!).getValue(),
		);
	}

	static fromPersistence(input: {
		id: string;
		name: string;
		createdAt: Date;
		updatedAt: Date;
		parentID?: string;
		slug?: string;
	}): Category {
		return new Category(
			input.id,
			input.name,
			input.createdAt,
			input.updatedAt,
			input.parentID,
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

	changeParentID(parentID: string) {
		this.touch();
		this.parentID = parentID;
	}

	private touch() {
		this.updatedAt = new Date();
	}
}

import { InvalidSlugException } from '../exceptions/slug/invalid-slug.exception';
export class Slug {
	private readonly value: string;

	constructor(slug: string) {
		if (!slug?.trim()) {
			throw new InvalidSlugException('El slug es requerido');
		}

		const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
		if (!slugRegex.test(slug)) {
			throw new InvalidSlugException(`El slug "${slug}" no es válido`);
		}

		this.value = slug;
	}

	getValue(): string {
		return this.value;
	}
}

import {
	BrandReader,
	BrandWriter,
} from 'src/domain/repositories/brand/brand.repository';
import { CreateBrandInput } from './create-brand.input';
import { CreateBrandOutput } from './create-brand.output';
import { Slugify } from 'src/shared/utils/slugify.util';
import { BrandWithThisNameAlreadyExistsException } from 'src/domain/exceptions/brand/brand-already-exists.exception';
import { Brand } from 'src/domain/entities/brand/brand.entity';

export class CreateBrandUseCase {
	constructor(
		private readonly brandWrite: BrandWriter,
		private readonly brandReader: BrandReader,
	) {}

	async execute(input: CreateBrandInput): Promise<CreateBrandOutput> {
		const { name, slug } = input;

		const generatedSlug = slug ?? Slugify.generate(name);

		if (await this.checkIfSlugExists(generatedSlug))
			throw new BrandWithThisNameAlreadyExistsException();

		const brand = Brand.create({ name: input.name, slug: generatedSlug });

		await this.brandWrite.create(brand);

		return {
			id: brand.id,
			name: brand.name,
			slug: brand.slug,
			createdAt: brand.createdAt,
			updatedAt: brand.updatedAt,
		};
	}

	private async checkIfSlugExists(slug: string): Promise<boolean> {
		const checkSlug = await this.brandReader.existBySlug(slug);
		if (checkSlug) return true;
		else return false;
	}
}

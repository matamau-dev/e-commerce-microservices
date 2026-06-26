import {
	BrandReader,
	BrandWriter,
} from 'src/domain/repositories/brand/brand.repository';
import { UpdateBrandInput } from './update-brand.input';
import { UpdateBrandOutput } from './update-brand.output';
import { BrandNotFoundException } from 'src/domain/exceptions/brand/brand-not-found.exception';
import { Slugify } from 'src/shared/utils/slugify.util';
import { BrandWithThisNameAlreadyExistsException } from 'src/domain/exceptions/brand/brand-already-exists.exception';
import { Brand } from 'src/domain/entities/brand/brand.entity';

export class UpdateBrandUseCase {
	constructor(
		private readonly brandWriter: BrandWriter,
		private readonly brandReader: BrandReader,
	) {}

	async execute(input: UpdateBrandInput): Promise<UpdateBrandOutput> {
		const brand = await this.findBrandOrFail(input.id);

		if (input.name !== undefined) {
			brand.changeName(input.name);
		}

		const nextSlug = this.resolveSlug(input);

		if (nextSlug !== undefined) {
			await this.ensureSlugIsAvailable(nextSlug, brand.id);
			brand.changeSlug(nextSlug);
		}

		await this.brandWriter.update(brand);

		return this.toOutput(brand);
	}

	private async findBrandOrFail(id: string): Promise<Brand> {
		const brand = await this.brandReader.findByID(id);

		if (!brand) {
			throw new BrandNotFoundException();
		}

		return brand;
	}

	private resolveSlug(input: UpdateBrandInput): string | undefined {
		if (input.slug !== undefined) {
			return input.slug;
		}

		if (input.name !== undefined) {
			return Slugify.generate(input.name);
		}

		return undefined;
	}

	private async ensureSlugIsAvailable(
		slug: string,
		currentBrandId: string,
	): Promise<void> {
		const existingBrand = await this.brandReader.findBySlug(slug);

		if (!existingBrand) {
			return;
		}

		if (existingBrand.id !== currentBrandId) {
			throw new BrandWithThisNameAlreadyExistsException();
		}
	}

	private toOutput(brand: Brand): UpdateBrandOutput {
		return {
			id: brand.id,
			name: brand.name,
			slug: brand.slug,
			createdAt: brand.createdAt,
			updatedAt: brand.updatedAt,
		};
	}
}

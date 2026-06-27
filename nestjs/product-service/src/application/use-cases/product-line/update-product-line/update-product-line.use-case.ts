import {
	ProductLineReader,
	ProductLineWriter,
} from 'src/domain/repositories/product-line/product-line.repository';
import { UpdateProductLineInput } from './update-product-line.input';
import { UpdateProductLineOutput } from './update-product-line.output';
import { ProductLineNotFoundException } from 'src/domain/exceptions/product-line/product-line-not-found.exception';
import { ProductLine } from 'src/domain/entities/product-line/product-line.entity';
import { Slugify } from 'src/shared/utils/slugify.util';
import { ProductLineAlreadyExists } from 'src/domain/exceptions/product-line/product-line-already-exists.exception';

export class UpdateProductLineUseCase {
	constructor(
		private readonly productLineWriter: ProductLineWriter,
		private readonly productLineReader: ProductLineReader,
	) {}

	async execute(
		input: UpdateProductLineInput,
	): Promise<UpdateProductLineOutput> {
		const productLine = await this.findProductLineOrFail(input.id);
		if (input.name !== undefined) {
			productLine.changeName(input.name);
		}

		const nextSlug = this.resolveSlug(input);

		if (nextSlug !== undefined) {
			await this.ensureSlugIsAvailable(nextSlug, input.id);
			productLine.changeSlug(nextSlug);
		}

		await this.productLineWriter.update(productLine);
		return this.toOutPut(productLine);
	}

	private async findProductLineOrFail(id: string): Promise<ProductLine> {
		const productLine = await this.productLineReader.findByID(id);
		if (!productLine) {
			throw new ProductLineNotFoundException();
		}
		return productLine;
	}

	private resolveSlug(input: UpdateProductLineInput): string | undefined {
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
		id: string,
	): Promise<void> {
		const slugAlreadyExists =
			await this.productLineReader.existsBySlugExcludingId(slug, id);
		if (slugAlreadyExists) {
			throw new ProductLineAlreadyExists(slug);
		}
	}

	private toOutPut(productLine: ProductLine): UpdateProductLineOutput {
		return {
			id: productLine.id,
			name: productLine.name,
			slug: productLine.slug!,
			createdAt: productLine.createdAt,
			updateAt: productLine.updatedAt,
		};
	}
}

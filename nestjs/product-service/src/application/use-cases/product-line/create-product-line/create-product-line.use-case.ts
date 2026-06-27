import {
	ProductLineReader,
	ProductLineWriter,
} from 'src/domain/repositories/product-line/product-line.repository';
import { ProductLineInput } from './create-product-line.input';
import { ProductLineOutput } from './create-product-line.output';
import { Slugify } from 'src/shared/utils/slugify.util';
import { ProductLineAlreadyExists } from 'src/domain/exceptions/product-line/product-line-already-exists.exception';
import { ProductLine } from 'src/domain/entities/product-line/product-line.entity';

export class ProductLieCreateUseCase {
	constructor(
		private readonly productLineWriter: ProductLineWriter,
		private readonly productLineReader: ProductLineReader,
	) {}

	async execute(input: ProductLineInput): Promise<ProductLineOutput> {
		const { name, slug } = input;
		const generatedSlug = slug ?? Slugify.generate(name);

		if (await this.checkIfSlugExists(generatedSlug)) {
			throw new ProductLineAlreadyExists(name);
		}

		const productLine = ProductLine.create({ name, slug: generatedSlug });
		await this.productLineWriter.create(productLine);

		return {
			id: productLine.id,
			name: productLine.name,
			slug: productLine.slug!,
			createdAt: productLine.createdAt,
			updatedAt: productLine.updatedAt,
		};
	}

	private async checkIfSlugExists(slug: string): Promise<boolean> {
		const checkSlug = await this.productLineReader.existsBySlug(slug);
		if (checkSlug) return true;
		else return false;
	}
}

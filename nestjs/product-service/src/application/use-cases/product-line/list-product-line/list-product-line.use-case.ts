import { ProductLineReader } from 'src/domain/repositories/product-line/product-line.repository';
import { ListProductLineInput } from './list-product-line.input';
import { ListProductLineOutput } from './list-product-line.output';

export class ListProductLineUseCase {
	constructor(private readonly productLineReader: ProductLineReader) {}

	async execute(input: ListProductLineInput): Promise<ListProductLineOutput> {
		const productLines = await this.productLineReader.findAll(input.query);
		return {
			...productLines,
			data: productLines.data.map((productLine) => ({
				id: productLine.id,
				name: productLine.name,
				slug: productLine.slug!,
				createdAt: productLine.createdAt,
				updatedAt: productLine.updatedAt,
			})),
		};
	}
}

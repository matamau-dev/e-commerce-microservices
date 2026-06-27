import {
	ProductLineReader,
	ProductLineWriter,
} from 'src/domain/repositories/product-line/product-line.repository';
import { SoftDeleteProductLineInput } from './soft-delete-product-line.input';
import { SoftDeleteProductLineOutput } from './soft-delete-product-line.output';
import { ProductLineNotFoundException } from 'src/domain/exceptions/product-line/product-line-not-found.exception';

export class SoftDeleteProductLineUseCase {
	constructor(
		private readonly productLineWriter: ProductLineWriter,
		private readonly productLineReader: ProductLineReader,
	) {}

	async execute(
		input: SoftDeleteProductLineInput,
	): Promise<SoftDeleteProductLineOutput> {
		await this.findProductLineOrFail(input.id);
		await this.productLineWriter.softDelete(input.id);
		return { message: 'Product Line Has Be Deleted' };
	}

	private async findProductLineOrFail(id): Promise<void> {
		const productLine = await this.productLineReader.findByID(id);
		if (!productLine) throw new ProductLineNotFoundException();
	}
}

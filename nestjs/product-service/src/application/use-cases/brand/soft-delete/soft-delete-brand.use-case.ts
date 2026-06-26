import {
	BrandReader,
	BrandWriter,
} from 'src/domain/repositories/brand/brand.repository';
import { SoftDeleteBrandInput } from './soft-delete-brand.input';
import { SoftDeleteBrandOutput } from './soft-delete-brand.output';
import { BrandNotFoundException } from 'src/domain/exceptions/brand/brand-not-found.exception';

export class SoftDeleteBrandUseCase {
	constructor(
		private readonly brandWriter: BrandWriter,
		private readonly brandReader: BrandReader,
	) {}

	async execute(input: SoftDeleteBrandInput): Promise<SoftDeleteBrandOutput> {
		const brand = await this.brandReader.findByID(input.id);
		if (!brand) throw new BrandNotFoundException();

		await this.brandWriter.softDelete(input.id);
		return { messagge: 'Brand has be deleted' };
	}
}

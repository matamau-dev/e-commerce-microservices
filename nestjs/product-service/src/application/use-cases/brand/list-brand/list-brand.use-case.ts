import { BrandReader } from 'src/domain/repositories/brand/brand.repository';
import { ListBrandOutput } from './list-brand.output';
import { ListBrandInput } from './list-brand.input';

export class ListBrandUseCase {
	constructor(private readonly brandReader: BrandReader) {}

	async execute(input: ListBrandInput): Promise<ListBrandOutput> {
		const brands = await this.brandReader.findAll(input.query);
		return {
			...brands,
			data: brands.data.map((brand) => ({
				id: brand.id,
				name: brand.name,
				slug: brand.slug,
				createdAt: brand.createdAt,
				updatedAt: brand.updatedAt,
			})),
		};
	}
}

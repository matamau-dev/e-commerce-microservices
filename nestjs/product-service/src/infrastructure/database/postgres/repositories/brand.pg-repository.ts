import {
	BrandReader,
	BrandWriter,
} from 'src/domain/repositories/brand/brand.repository';
import { BrandOrmEntity } from '../orm-entities/brand.orm-entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from 'src/domain/entities/brand/brand.entity';
import { CursorQuery } from 'src/domain/pagination/cursor-query.interface';
import { CursorResult } from 'src/domain/pagination/cursor-result.interface';
import { TypeormCursorPagination } from 'src/infrastructure/pagination/typeorm-cursor.pagination';
import { BrandMapper } from 'src/infrastructure/mappers/brand.mapper';

export class BrandPgRepository implements BrandWriter, BrandReader {
	constructor(
		@InjectRepository(BrandOrmEntity)
		private readonly brandRepository: Repository<BrandOrmEntity>,
		private readonly pagination: TypeormCursorPagination,
	) {}

	async findAll(query: CursorQuery): Promise<CursorResult<Brand>> {
		const qb = await this.brandRepository
			.createQueryBuilder('brands')
			.where('brands.deleted_at IS NULL');

		const result = await this.pagination.paginate(
			qb,
			query,
			'brands',
			'created_at',
		);

		return {
			...result,
			data: result.data.map((brand) =>
				BrandMapper.BrandOrmToBrandDomain(brand),
			),
		};
	}

	async findByID(id: string): Promise<Brand | null> {
		const brand = await this.brandRepository.findOneBy({ id });
		return brand ? BrandMapper.BrandOrmToBrandDomain(brand) : null;
	}

	async findBySlug(slug: string): Promise<Brand | null> {
		const brand = await this.brandRepository.findOneBy({ slug });
		return brand ? BrandMapper.BrandOrmToBrandDomain(brand) : null;
	}

	async existBySlug(slug: string): Promise<boolean> {
		return await this.brandRepository.existsBy({ slug });
	}

	async create(brand: Brand): Promise<Brand> {
		const save = await this.brandRepository.save(
			BrandMapper.BrandDomainToBrandOrm(brand),
		);
		return BrandMapper.BrandOrmToBrandDomain(save);
	}

	async update(brand: Brand): Promise<Brand> {
		const updated = await this.brandRepository.save(
			BrandMapper.BrandDomainToBrandOrm(brand),
		);
		return BrandMapper.BrandOrmToBrandDomain(updated);
	}

	async softDelete(id: string): Promise<void> {
		await this.brandRepository.softDelete(id);
	}
}

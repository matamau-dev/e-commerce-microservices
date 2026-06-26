import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/domain/entities/address/address.entity';
import { CursorQuery } from 'src/domain/pagination/cursor-query.interface';
import { CursorResult } from 'src/domain/pagination/cursor-result.interface';
import {
	AddressReader,
	AddressWriter,
} from 'src/domain/repositories/address/address.repository';
import { AddressOrmEntity } from '../orm-entities/address.orm-entity';
import { Repository } from 'typeorm';
import { TypeormCursorPagination } from 'src/infrastructure/pagination/typeorm-cursor.pagination';
import { AddressMapper } from 'src/infrastructure/mappers/address.maper';

export class AddressPgRepository implements AddressReader, AddressWriter {
	constructor(
		@InjectRepository(AddressOrmEntity)
		private readonly orm: Repository<AddressOrmEntity>,
		private readonly pagination: TypeormCursorPagination,
	) {}

	async findAll(
		userId: string,
		query: CursorQuery,
	): Promise<CursorResult<Address>> {
		const qb = this.orm
			.createQueryBuilder('address')
			.where('address.user_id = :userId', { userId })
			.andWhere('address.deleted_at IS NULL');

		const result = await this.pagination.paginate(
			qb,
			query,
			'address',
			'createdAt',
		);
		return {
			...result,
			data: result.data.map((a) =>
				AddressMapper.AddressORMtoAddressDomain(a),
			),
		};
	}

	async findById(id: string): Promise<Address | null> {
		const found = await this.orm.findOne({ where: { id } });
		return found ? AddressMapper.AddressORMtoAddressDomain(found) : null;
	}

	async create(address: Address): Promise<Address> {
		const saved = await this.orm.save(
			AddressMapper.AddressDomainToAddressORM(address),
		);
		return AddressMapper.AddressORMtoAddressDomain(saved);
	}

	async update(address: Address): Promise<Address | null> {
		const update = await this.orm.save(
			AddressMapper.AddressDomainToAddressORM(address),
		);
		return update ? AddressMapper.AddressORMtoAddressDomain(update) : null;
	}

	async softDelete(id: string): Promise<string> {
		await this.orm.softDelete(id);
		return 'Direccion eliminada';
	}

	async permanentDelete(id: string): Promise<string> {
		await this.orm.findOne({ withDeleted: true, where: { id } });
		return 'Dirrecion eliminada permanentemente';
	}

	async findByUserId(userId: string): Promise<Address[]> {
		const addresses = await this.orm.find({
			where: { userId },
		});

		return addresses.map(AddressMapper.AddressORMtoAddressDomain);
	}

	async findDefaultByUserId(userId: string): Promise<Address | null> {
		const address = await this.orm.findOne({
			where: {
				userId,
				isDefault: true,
			},
		});

		return address
			? AddressMapper.AddressORMtoAddressDomain(address)
			: null;
	}

	async clearDefaultByUserId(userId: string): Promise<void> {
		await this.orm.update(
			{ userId, isDefault: true },
			{ isDefault: false },
		);
	}
}

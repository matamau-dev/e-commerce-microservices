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
import { Location } from 'src/domain/entities/address/location.entity';

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
			data: result.data.map((a) => this.toDomain(a)),
		};
	}

	async findById(id: string): Promise<Address | null> {
		const found = await this.orm.findOne({ where: { id } });
		return found ? this.toDomain(found) : null;
	}

	async create(address: Address): Promise<Address> {
		const saved = await this.orm.save(this.toOrm(address));
		return this.toDomain(saved);
	}

	async update(address: Address): Promise<Address | null> {
		const update = await this.orm.save(this.toOrm(address));
		return update ? this.toDomain(update) : null;
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

		return addresses.map(this.toDomain);
	}

	async findDefaultByUserId(userId: string): Promise<Address | null> {
		const address = await this.orm.findOne({
			where: {
				userId,
				isDefault: true,
			},
		});

		return address ? this.toDomain(address) : null;
	}

	async clearDefaultByUserId(userId: string): Promise<void> {
		await this.orm.update(
			{ userId, isDefault: true },
			{ isDefault: false },
		);
	}

	private toDomain(orm: AddressOrmEntity): Address {
		return Address.fromPersistence({
			id: orm.id,
			fullName: orm.fullName,
			phone: orm.phone,
			location: Location.create({
				street: orm.street,
				externalNumber: orm.externalNumber,
				neighborhood: orm.neighborhood,
				city: orm.city,
				state: orm.state,
				postalCode: orm.postalCode,
				internalNumber: orm.internalNumber,
			}),
			isDefault: orm.isDefault,
			userId: orm.userId,
			createdAt: orm.createdAt,
			references: orm.referenceNotes,
			updatedAt: orm.updatedAt,
		});
	}

	private toOrm(address: Address): Partial<AddressOrmEntity> {
		return {
			id: address.id,
			fullName: address.fullName,
			phone: address.phone.getValue(),
			street: address.location.street,
			externalNumber: address.location.externalNumber,
			neighborhood: address.location.neighborhood,
			city: address.location.city,
			state: address.location.state,
			postalCode: address.location.postalCode.getValue(),
			isDefault: address.isDefault,
			userId: address.userId,
			createdAt: address.createdAt,
			internalNumber: address.location.internalNumber,
			referenceNotes: address.references,
			updatedAt: address.updatedAt,
		};
	}
}

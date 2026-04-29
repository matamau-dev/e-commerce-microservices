import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListAddressesUseCase } from 'src/application/use-cases/address/list-address/list-address.use-case';
import { NewAddressUseCase } from 'src/application/use-cases/address/new-address/new-address.use-cases';
import { PermaDeleteAddressUseCase } from 'src/application/use-cases/address/perma-delete-address/perma-delete-address.usecase';
import { SoftDeleteAddressUseCase } from 'src/application/use-cases/address/soft-delete-address/soft-delete-address.usecase';
import { UpdateAddressUseCase } from 'src/application/use-cases/address/update-address/update-address.use-case';
import { AddressOrmEntity } from 'src/infrastructure/database/postgres/orm-entities/address.orm-entity';
import { UserOrmEntity } from 'src/infrastructure/database/postgres/orm-entities/user.orm-entity';
import { AddressPgRepository } from 'src/infrastructure/database/postgres/repositories/address.pg-repository';
import { UserPgRepository } from 'src/infrastructure/database/postgres/repositories/user.pg-repository';
import { TypeormCursorPagination } from 'src/infrastructure/pagination/typeorm-cursor.pagination';
import { AddressController } from 'src/presentation/controllers/address.controller';

@Module({
	imports: [TypeOrmModule.forFeature([AddressOrmEntity, UserOrmEntity])],
	controllers: [AddressController],
	providers: [
		TypeormCursorPagination,
		{ provide: 'AddressReader', useClass: AddressPgRepository },
		{ provide: 'AddressWriter', useClass: AddressPgRepository },
		{ provide: 'UserReader', useClass: UserPgRepository },
		{
			provide: ListAddressesUseCase,
			useFactory: (addressReader) =>
				new ListAddressesUseCase(addressReader),
			inject: ['AddressReader'],
		},
		{
			provide: NewAddressUseCase,
			useFactory: (addressWriter, addressReader, userReader) =>
				new NewAddressUseCase(addressWriter, addressReader, userReader),
			inject: ['AddressWriter', 'AddressReader', 'UserReader'],
		},
		{
			provide: PermaDeleteAddressUseCase,
			useFactory: (addressWriter, addressReader) =>
				new PermaDeleteAddressUseCase(addressWriter, addressReader),
			inject: ['AddressWriter', 'AddressReader'],
		},
		{
			provide: SoftDeleteAddressUseCase,
			useFactory: (addressWriter, addressReader) =>
				new SoftDeleteAddressUseCase(addressWriter, addressReader),
			inject: ['AddressWriter', 'AddressReader'],
		},
		{
			provide: UpdateAddressUseCase,
			useFactory: (addressWriter, addressReader) =>
				new UpdateAddressUseCase(addressWriter, addressReader),
			inject: ['AddressWriter', 'AddressReader'],
		},
	],
})
export class AddressModule {}

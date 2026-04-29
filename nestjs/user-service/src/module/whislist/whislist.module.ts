import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddProductToMyWishlistUseCase } from 'src/application/use-cases/wishlist/add-item-to-my-wishlist/add-item-to-my-wishlist.usecase';
import { AddItemUseCase } from 'src/application/use-cases/wishlist/add-item/add-item.usecase';
import { CreateWishlistUseCase } from 'src/application/use-cases/wishlist/create-wishlist/create-wishlist.usecase';
import { DeleteWishlistUseCase } from 'src/application/use-cases/wishlist/delete-wishlist/delete-wishlist.usecase';
import { GetWishlistUseCase } from 'src/application/use-cases/wishlist/get-wishlist/get-wishlist.usecase';
import { ListWishUseCase } from 'src/application/use-cases/wishlist/list-wishlist/list-wishlist.usecase';
import { RemoveItemUseCase } from 'src/application/use-cases/wishlist/remove-item/remove-item.usecase';
import { ShareWishlistUseCase } from 'src/application/use-cases/wishlist/share-wishlist/shre-wishlist.usecase';
import { UserOrmEntity } from 'src/infrastructure/database/postgres/orm-entities/user.orm-entity';
import { WishlistItemOrmEntity } from 'src/infrastructure/database/postgres/orm-entities/whislist/wishlist-item.orm-entity';
import { WishlistOrmEntity } from 'src/infrastructure/database/postgres/orm-entities/whislist/wishlist.orm-entity';
import { UserPgRepository } from 'src/infrastructure/database/postgres/repositories/user.pg-repository';
import { WishlistPgRepository } from 'src/infrastructure/database/postgres/repositories/wishlist.pg-repository';
import { TypeormTransactionManager } from 'src/infrastructure/database/postgres/typeorm-transaction.manager';
import { TypeormCursorPagination } from 'src/infrastructure/pagination/typeorm-cursor.pagination';
import { WishlistController } from 'src/presentation/controllers/whislist.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			WishlistOrmEntity,
			UserOrmEntity,
			WishlistItemOrmEntity,
		]),
	],
	controllers: [WishlistController],
	providers: [
		TypeormCursorPagination,
		{
			provide: 'TransactionManager',
			useClass: TypeormTransactionManager,
		},
		{ provide: 'WishlistReader', useClass: WishlistPgRepository },
		{ provide: 'WishlistWriter', useClass: WishlistPgRepository },
		{
			provide: 'UserReader',
			useClass: UserPgRepository,
		},
		{
			provide: ListWishUseCase,
			useFactory: (wishlistReader) => new ListWishUseCase(wishlistReader),
			inject: ['WishlistReader'],
		},
		{
			provide: GetWishlistUseCase,
			useFactory: (wishlistReader) =>
				new GetWishlistUseCase(wishlistReader),
			inject: ['WishlistReader'],
		},
		{
			provide: CreateWishlistUseCase,
			useFactory: (wishlistWriter, wishlistReader) =>
				new CreateWishlistUseCase(wishlistWriter, wishlistReader),
			inject: ['WishlistReader', 'WishlistWriter'],
		},
		{
			provide: AddItemUseCase,
			useFactory: (wishlistWriter, wishlistReader) =>
				new AddItemUseCase(wishlistWriter, wishlistReader),
			inject: ['WishlistReader', 'WishlistWriter'],
		},
		{
			provide: AddProductToMyWishlistUseCase,
			useFactory: (wishlistWriter, wishlistReader) =>
				new AddProductToMyWishlistUseCase(
					wishlistWriter,
					wishlistReader,
				),
			inject: ['WishlistReader', 'WishlistWriter'],
		},
		{
			provide: DeleteWishlistUseCase,
			useFactory: (wishlistReader, wishlistWriter, transactionManager) =>
				new DeleteWishlistUseCase(wishlistReader, wishlistWriter),
			inject: ['WishlistReader', 'WishlistWriter'],
		},
		{
			provide: RemoveItemUseCase,
			useFactory: (wishlistWriter, wishlistReader) =>
				new RemoveItemUseCase(wishlistWriter, wishlistReader),
			inject: ['WishlistReader', 'WishlistWriter'],
		},
		{
			provide: ShareWishlistUseCase,
			useFactory: (wishlistWriter, wishlistReader, userReader) =>
				new ShareWishlistUseCase(
					wishlistWriter,
					wishlistReader,
					userReader,
				),
			inject: ['WishlistReader', 'WishlistWriter', 'UserReader'],
		},
	],
})
export class WishlistModule {}

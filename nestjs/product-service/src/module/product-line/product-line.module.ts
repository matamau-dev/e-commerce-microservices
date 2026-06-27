import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductLineOrmEntity } from 'src/infrastructure/database/postgres/orm-entities/product-line.orm-entity';
import { ProductLinePgRepository } from 'src/infrastructure/database/postgres/repositories/product-line.pg-repository';
import { TypeormCursorPagination } from 'src/infrastructure/pagination/typeorm-cursor.pagination';
import { ProductLineController } from 'src/presentation/controllers/product-line.controller';
import { SoftDeleteProductLineUseCase } from 'src/application/use-cases/product-line/soft-delete-product-line/soft-delete-product-line.use-case';
import { UpdateProductLineUseCase } from 'src/application/use-cases/product-line/update-product-line/update-product-line.use-case';
import { ProductLieCreateUseCase } from 'src/application/use-cases/product-line/create-product-line/create-product-line.use-case';
import { ListProductLineUseCase } from 'src/application/use-cases/product-line/list-product-line/list-product-line.use-case';

@Module({
	imports: [TypeOrmModule.forFeature([ProductLineOrmEntity])],
	controllers: [ProductLineController],
	providers: [
		TypeormCursorPagination,
		{ provide: 'ProductLineReader', useClass: ProductLinePgRepository },
		{ provide: 'ProductLineWriter', useClass: ProductLinePgRepository },
		{
			provide: ProductLieCreateUseCase,
			useFactory: (productLineReader, productLineWriter) =>
				new ProductLieCreateUseCase(
					productLineWriter,
					productLineReader,
				),
			inject: ['ProductLineReader', 'ProductLineWriter'],
		},
		{
			provide: ListProductLineUseCase,
			useFactory: (productLineReader) =>
				new ListProductLineUseCase(productLineReader),
			inject: ['ProductLineReader'],
		},
		{
			provide: UpdateProductLineUseCase,
			useFactory: (productLineReader, productLineWriter) =>
				new UpdateProductLineUseCase(
					productLineWriter,
					productLineReader,
				),
			inject: ['ProductLineReader', 'ProductLineWriter'],
		},
		{
			provide: SoftDeleteProductLineUseCase,
			useFactory: (productLineReader, productLineWriter) =>
				new SoftDeleteProductLineUseCase(
					productLineWriter,
					productLineReader,
				),
			inject: ['ProductLineReader', 'ProductLineWriter'],
		},
	],
	exports: [],
})
export class ProductLineModule {}

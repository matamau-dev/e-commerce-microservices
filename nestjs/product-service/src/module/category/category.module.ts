import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListCategoryTreeUseCase } from 'src/application/use-cases/category/list-category-tree/list-category-tree.use-case';
import { ListCategoryUseCase } from 'src/application/use-cases/category/list-category/list-category.use-case';
import { CreateCategoryUseCase } from 'src/application/use-cases/category/new-category/new-category.use-case';
import { SoftDeleteCategoryUseCase } from 'src/application/use-cases/category/soft-delete/soft-delete-category.use-case';
import { UpdateCategoryUseCase } from 'src/application/use-cases/category/update-category/update-category.use-case';
import { CategoryOrmEntity } from 'src/infrastructure/database/postgres/orm-entities/category.orm-entity';
import { CategoryPgRepository } from 'src/infrastructure/database/postgres/repositories/category.pg-repository';
import { TypeormCursorPagination } from 'src/infrastructure/pagination/typeorm-cursor.pagination';

import { CategoryController } from 'src/presentation/controllers/category.controller';

@Module({
	imports: [TypeOrmModule.forFeature([CategoryOrmEntity])],
	controllers: [CategoryController],
	providers: [
		TypeormCursorPagination,
		{ provide: 'CategoryReader', useClass: CategoryPgRepository },
		{ provide: 'CategoryWriter', useClass: CategoryPgRepository },
		{
			provide: ListCategoryUseCase,
			useFactory: (categoryReader) =>
				new ListCategoryUseCase(categoryReader),
			inject: ['CategoryReader'],
		},
		{
			provide: ListCategoryTreeUseCase,
			useFactory: (categoryReader) =>
				new ListCategoryTreeUseCase(categoryReader),
			inject: ['CategoryReader'],
		},
		{
			provide: CreateCategoryUseCase,
			useFactory: (categoryReader, categoryWriter) =>
				new CreateCategoryUseCase(categoryReader, categoryWriter),
			inject: ['CategoryReader', 'CategoryWriter'],
		},
		{
			provide: UpdateCategoryUseCase,
			useFactory: (categoryReader, categoryWriter) =>
				new UpdateCategoryUseCase(categoryReader, categoryWriter),
			inject: ['CategoryReader', 'CategoryWriter'],
		},
		{
			provide: SoftDeleteCategoryUseCase,
			useFactory: (categoryReader, categoryWriter) =>
				new SoftDeleteCategoryUseCase(categoryReader, categoryWriter),
			inject: ['CategoryReader', 'CategoryWriter'],
		},
	],
})
export class CategoryModule {}

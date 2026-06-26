import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateBrandUseCase } from 'src/application/use-cases/brand/create-brand/create-brand.use-case';
import { ListBrandUseCase } from 'src/application/use-cases/brand/list-brand/list-brand.use-case';
import { SoftDeleteBrandUseCase } from 'src/application/use-cases/brand/soft-delete/soft-delete-brand.use-case';
import { UpdateBrandUseCase } from 'src/application/use-cases/brand/update-brand/update-brand.use-case';
import { BrandOrmEntity } from 'src/infrastructure/database/postgres/orm-entities/brand.orm-entity';
import { BrandPgRepository } from 'src/infrastructure/database/postgres/repositories/brand.pg-repository';
import { TypeormCursorPagination } from 'src/infrastructure/pagination/typeorm-cursor.pagination';
import { BrandController } from 'src/presentation/controllers/brand.controller';

@Module({
	imports: [TypeOrmModule.forFeature([BrandOrmEntity])],
	controllers: [BrandController],
	providers: [
		TypeormCursorPagination,
		{ provide: 'BrandReader', useClass: BrandPgRepository },
		{ provide: 'BrandWriter', useClass: BrandPgRepository },
		{
			provide: ListBrandUseCase,
			useFactory: (brandReader) => new ListBrandUseCase(brandReader),
			inject: ['BrandReader'],
		},
		{
			provide: CreateBrandUseCase,
			useFactory: (brandReader, brandWriter) =>
				new CreateBrandUseCase(brandWriter, brandReader),
			inject: ['BrandReader', 'BrandWriter'],
		},
		{
			provide: UpdateBrandUseCase,
			useFactory: (brandReader, brandWriter) =>
				new UpdateBrandUseCase(brandWriter, brandReader),
			inject: ['BrandReader', 'BrandWriter'],
		},
		{
			provide: SoftDeleteBrandUseCase,
			useFactory: (brandReader, brandWriter) =>
				new SoftDeleteBrandUseCase(brandWriter, brandReader),
			inject: ['BrandReader', 'BrandWriter'],
		},
	],
})
export class BrandModule {}

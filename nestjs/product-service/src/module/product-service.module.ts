import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';

@Module({
	imports: [CategoryModule, BrandModule],
})
export class ProductServiceModule {}

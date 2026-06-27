import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { ProductLineModule } from './product-line/product-line.module';

@Module({
	imports: [CategoryModule, BrandModule, ProductLineModule],
})
export class ProductServiceModule {}

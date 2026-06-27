import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ProductLieCreateUseCase } from 'src/application/use-cases/product-line/create-product-line/create-product-line.use-case';
import { ListProductLineUseCase } from 'src/application/use-cases/product-line/list-product-line/list-product-line.use-case';
import { SoftDeleteProductLineUseCase } from 'src/application/use-cases/product-line/soft-delete-product-line/soft-delete-product-line.use-case';
import { UpdateProductLineUseCase } from 'src/application/use-cases/product-line/update-product-line/update-product-line.use-case';
import { CreateProductLineDto } from '../dtos/product-line/create-product-line.dto';
import { ListPageDto } from '../dtos/utils/list-page.dto';
import { UpdateProductLineDto } from '../dtos/product-line/update-product-line.dto';

@Controller('product-lines')
@ApiTags('Product Lines')
export class ProductLineController {
	constructor(
		private readonly productLineCreateUseCase: ProductLieCreateUseCase,
		private readonly listProductLineUseCase: ListProductLineUseCase,
		private readonly softDeleteProductLineUseCase: SoftDeleteProductLineUseCase,
		private readonly updateProductLineUseCase: UpdateProductLineUseCase,
	) {}

	@Get()
	@ApiOperation({
		summary: 'Listado por cursor, las lineas de producto',
		description: 'Muestra todas las lineas de producto disponible.',
	})
	async findAll(@Query() query: ListPageDto) {
		return this.listProductLineUseCase.execute({ query });
	}

	@Post()
	@ApiOperation({
		summary: 'Crear una nueva linea de producto',
		description: 'Crear una nuevla linea de producto',
	})
	async create(@Body() create: CreateProductLineDto) {
		return this.productLineCreateUseCase.execute({
			name: create.productLine,
			slug: create.slug,
		});
	}

	@Patch(':id')
	@ApiOperation({
		summary: 'Actualizar una linea de producto',
		description:
			'Actualiza la linea de producto seleccionado mediante su ID',
	})
	async update(
		@Param('id') id: string,
		@Body() updated: UpdateProductLineDto,
	) {
		return this.updateProductLineUseCase.execute({
			id,
			name: updated.productLine,
			slug: updated.slug,
		});
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Eliminar una linea de product',
		description: 'Elimina una linea de producto con su idenfiticador unico',
	})
	async delete(@Param('id') id: string) {
		return this.softDeleteProductLineUseCase.execute({ id });
	}
}

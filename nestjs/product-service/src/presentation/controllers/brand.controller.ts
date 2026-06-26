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
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateBrandUseCase } from 'src/application/use-cases/brand/create-brand/create-brand.use-case';
import { ListBrandUseCase } from 'src/application/use-cases/brand/list-brand/list-brand.use-case';
import { SoftDeleteBrandUseCase } from 'src/application/use-cases/brand/soft-delete/soft-delete-brand.use-case';
import { UpdateBrandUseCase } from 'src/application/use-cases/brand/update-brand/update-brand.use-case';
import { ListPageDto } from '../dtos/utils/list-page.dto';
import { CreateBrandDto } from '../dtos/brand/create-brand.dto';
import { UpdateBrandDto } from '../dtos/brand/update-brand.dto';

@Controller('brands')
@ApiTags('Brands')
export class BrandController {
	constructor(
		private readonly listBrandUseCase: ListBrandUseCase,
		private readonly createBrandUseCase: CreateBrandUseCase,
		private readonly updateUseCase: UpdateBrandUseCase,
		private readonly softDeleteBrandUseCase: SoftDeleteBrandUseCase,
	) {}

	@Get()
	@ApiOperation({
		summary: 'Listar marcas',
		description:
			'Obtiene una lista paginada de marcas uilizando paginacion por cursor.',
	})
	findAll(@Query() query: ListPageDto) {
		return this.listBrandUseCase.execute({ query });
	}

	@Post()
	@ApiOperation({
		summary: 'Crear marca',
		description: 'Crea una nueva marca.',
	})
	create(@Body() body: CreateBrandDto) {
		return this.createBrandUseCase.execute({
			name: body.name,
			slug: body.slug,
		});
	}

	@Patch(':id')
	@ApiOperation({
		summary: 'Actualizar marca',
		description: 'Actualiza parcialmente una marca existente.',
	})
	@ApiParam({
		name: 'id',
		description: 'Identificador unico de la categoria',
		required: true,
		example: 'a3d7c1f8-9f6d-4f4f-8e4c-2d6e5b8a1c22',
	})
	update(@Param('id') id: string, @Body() body: UpdateBrandDto) {
		return this.updateUseCase.execute({ id, ...body });
	}

	@Delete('id')
	@ApiOperation({
		summary: 'Eliminar marca',
		description: 'Realiza un borrado logico (soft delete) de la marca.',
	})
	@ApiParam({
		name: 'id',
		description: 'Identificador unico de la marca',
		required: true,
		example: 'a3d7c1f8-9f6d-4f4f-8e4c-2d6e5b8a1c22',
	})
	remove(@Param('id') id: string) {
		return this.softDeleteBrandUseCase.execute({ id });
	}
}

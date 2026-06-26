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
import { ListCategoryUseCase } from 'src/application/use-cases/category/list-category/list-category.use-case';
import { CreateCategoryUseCase } from 'src/application/use-cases/category/new-category/new-category.use-case';
import { SoftDeleteCategoryUseCase } from 'src/application/use-cases/category/soft-delete/soft-delete-category.use-case';
import { UpdateCategoryUseCase } from 'src/application/use-cases/category/update-category/update-category.use-case';
import { ListPageDto } from '../dtos/utils/list-page.dto';
import { CreateCategoryDto } from '../dtos/category/create-category.dto';
import { UpdateCategoryDto } from '../dtos/category/update-category.dto';
import { ListCategoryTreeUseCase } from 'src/application/use-cases/category/list-category-tree/list-category-tree.use-case';

@Controller('categories')
@ApiTags('Categories')
export class CategoryController {
	constructor(
		private readonly listCategoryUseCase: ListCategoryUseCase,
		private readonly listCategoryTreeUseCase: ListCategoryTreeUseCase,
		private readonly createCategoryUseCase: CreateCategoryUseCase,
		private readonly updateCategoryUseCase: UpdateCategoryUseCase,
		private readonly softDeleteCategoryUseCase: SoftDeleteCategoryUseCase,
	) {}

	@Get()
	@ApiOperation({
		summary: 'Listar categorías',
		description:
			'Obtiene una lista paginada de categorías utilizando paginación por cursor.',
	})
	findAll(@Query() query: ListPageDto) {
		return this.listCategoryUseCase.execute({
			query,
		});
	}

	@Get('/tree')
	@ApiOperation({
		summary: 'Listar categorías en árbol',
		description: 'Obtiene una lista de categorías en forma de árbol.',
	})
	findAllTree() {
		return this.listCategoryTreeUseCase.execute();
	}

	@Post()
	@ApiOperation({
		summary: 'Crear categoría',
		description:
			'Crea una nueva categoría. Puede asociarse opcionalmente a una categoría padre.',
	})
	create(@Body() body: CreateCategoryDto) {
		return this.createCategoryUseCase.execute({
			name: body.name,
			parentID: body.parentID,
			slug: body.slug,
		});
	}

	@Patch(':id')
	@ApiOperation({
		summary: 'Actualizar categoría',
		description: 'Actualiza parcialmente una categoría existente.',
	})
	@ApiParam({
		name: 'id',
		description: 'Identificador único de la categoría',
		example: 'a3d7c1f8-9f6d-4f4f-8e4c-2d6e5b8a1c22',
	})
	update(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
		return this.updateCategoryUseCase.execute({
			id,
			...body,
		});
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Eliminar categoría',
		description: 'Realiza un borrado lógico (soft delete) de la categoría.',
	})
	@ApiParam({
		name: 'id',
		description: 'Identificador único de la categoría',
		example: 'a3d7c1f8-9f6d-4f4f-8e4c-2d6e5b8a1c22',
	})
	remove(@Param('id') id: string) {
		return this.softDeleteCategoryUseCase.execute({
			id,
		});
	}
}

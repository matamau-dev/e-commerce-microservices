import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ListAddressesUseCase } from 'src/application/use-cases/address/list-address/list-address.use-case';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ListPageDto } from '../dtos/utils/list-page.dto';
import { CreateAddressDto } from '../dtos/address/create-address.dto';
import { NewAddressUseCase } from 'src/application/use-cases/address/new-address/new-address.use-cases';
import { UpdateAddressUseCase } from 'src/application/use-cases/address/update-address/update-address.use-case';
import { UpdateAddressDto } from '../dtos/address/update-address.dto';
import { SoftDeleteAddressUseCase } from 'src/application/use-cases/address/soft-delete-address/soft-delete-address.usecase';
import { PermaDeleteAddressUseCase } from 'src/application/use-cases/address/perma-delete-address/perma-delete-address.usecase';
import { RoleEnum } from 'src/domain/enums/role.enum';
import { Auth } from '../decorators/auth.decorator';
import {
	ApiTags,
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiQuery,
} from '@nestjs/swagger';

@Controller('users/addresses')
@UseGuards(JwtAuthGuard)
@ApiTags('Addresses')
@ApiBearerAuth()
export class AddressController {
	constructor(
		private readonly listAddresses: ListAddressesUseCase,
		private readonly createAddress: NewAddressUseCase,
		private readonly updateAddress: UpdateAddressUseCase,
		private readonly softDeleteAddress: SoftDeleteAddressUseCase,
		private readonly permaDelete: PermaDeleteAddressUseCase,
	) {}

	@Get()
	@Auth(RoleEnum.CLIENTE)
	@ApiOperation({ summary: 'Listar direcciones del usuario autenticado' })
	@ApiResponse({ status: 200, description: 'Lista de direcciones' })
	@ApiResponse({ status: 401, description: 'No autorizado' })
	findAll(@CurrentUser('id') userId: string, @Query() query: ListPageDto) {
		return this.listAddresses.execute({ userId, query });
	}

	@Post()
	@Auth(RoleEnum.CLIENTE)
	@ApiOperation({ summary: 'Crear una nueva dirección' })
	@ApiResponse({ status: 201, description: 'Dirección creada correctamente' })
	@ApiResponse({ status: 400, description: 'Datos inválidos' })
	create(@Body() dto: CreateAddressDto, @CurrentUser('id') userId: string) {
		return this.createAddress.execute({
			...dto,
			userId,
		});
	}

	@Patch(':id')
	@Auth(RoleEnum.CLIENTE)
	@ApiOperation({ summary: 'Actualizar una dirección' })
	@ApiParam({
		name: 'id',
		description: 'ID de la dirección',
		example: 'uuid-address-id',
	})
	@ApiResponse({ status: 200, description: 'Dirección actualizada' })
	@ApiResponse({ status: 404, description: 'Dirección no encontrada' })
	patch(
		@Param('id') id: string,
		@Body() dto: UpdateAddressDto,
		@CurrentUser('id') userId: string,
	) {
		return this.updateAddress.execute({
			id,
			userId,
			...dto,
		});
	}

	@Delete(':id')
	@Auth(RoleEnum.CLIENTE)
	@ApiOperation({ summary: 'Eliminar (soft delete) una dirección' })
	@ApiParam({
		name: 'id',
		description: 'ID de la dirección',
		example: 'uuid-address-id',
	})
	@ApiResponse({ status: 200, description: 'Dirección eliminada' })
	@ApiResponse({ status: 404, description: 'Dirección no encontrada' })
	delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.softDeleteAddress.execute({ id, userId });
	}

	@Delete(':id/permanent')
	@Auth(RoleEnum.SUPERVISOR)
	@ApiOperation({ summary: 'Eliminar permanentemente una dirección (admin)' })
	@ApiParam({
		name: 'id',
		description: 'ID de la dirección',
		example: 'uuid-address-id',
	})
	@ApiResponse({
		status: 200,
		description: 'Dirección eliminada permanentemente',
	})
	@ApiResponse({ status: 403, description: 'Sin permisos' })
	permDelete(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.permaDelete.execute({ id, userId });
	}
}

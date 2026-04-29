import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { GetWishlistUseCase } from 'src/application/use-cases/wishlist/get-wishlist/get-wishlist.usecase';
import { CreateWishlistUseCase } from 'src/application/use-cases/wishlist/create-wishlist/create-wishlist.usecase';
import { AddItemUseCase } from 'src/application/use-cases/wishlist/add-item/add-item.usecase';
import { AddProductToMyWishlistUseCase } from 'src/application/use-cases/wishlist/add-item-to-my-wishlist/add-item-to-my-wishlist.usecase';
import { DeleteWishlistUseCase } from 'src/application/use-cases/wishlist/delete-wishlist/delete-wishlist.usecase';
import { MakePrivateUseCase } from 'src/application/use-cases/wishlist/make-private/make-private.usecase';
import { MakePublicUseCase } from 'src/application/use-cases/wishlist/make-public/make-public.usecase';
import { RemoveItemUseCase } from 'src/application/use-cases/wishlist/remove-item/remove-item.usecase';
import { ShareWishlistUseCase } from 'src/application/use-cases/wishlist/share-wishlist/shre-wishlist.usecase';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ListPageDto } from '../dtos/utils/list-page.dto';
import { Auth } from '../decorators/auth.decorator';
import { RoleEnum } from 'src/domain/enums/role.enum';
import { CreateWishlistDto } from '../dtos/wishlist/create-wishlist.dto';
import { AddWishlistItemDto } from '../dtos/wishlist/add-wishlist-item.dto';
import { ShareWishlistDto } from '../dtos/wishlist/share-wishlist.dto';
import { ListWishUseCase } from 'src/application/use-cases/wishlist/list-wishlist/list-wishlist.usecase';

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlists')
export class WishlistController {
	constructor(
		private readonly listWishUseCase: ListWishUseCase,
		private readonly getWishlistUseCase: GetWishlistUseCase,
		private readonly createWishlistUseCase: CreateWishlistUseCase,
		private readonly addItemUseCase: AddItemUseCase,
		private readonly addProductToMyWishlistUseCase: AddProductToMyWishlistUseCase,
		private readonly deleteWishlistUseCase: DeleteWishlistUseCase,
		private readonly removeItemUseCase: RemoveItemUseCase,
		private readonly shareWishlistUseCase: ShareWishlistUseCase,
	) {}

	@Get()
	@Auth(RoleEnum.CLIENTE)
	@ApiOperation({ summary: 'Listar wishlists del usuario autenticado' })
	@ApiResponse({ status: 200, description: 'Listado obtenido correctamente' })
	findAll(@CurrentUser('id') userId: string, @Query() query: ListPageDto) {
		return this.listWishUseCase.execute({
			userId,
			query,
		});
	}

	@Post()
	@Auth(RoleEnum.CLIENTE)
	@ApiOperation({ summary: 'Crear wishlist' })
	@ApiResponse({ status: 201, description: 'Wishlist creada correctamente' })
	create(@Body() dto: CreateWishlistDto, @CurrentUser('id') userId: string) {
		return this.createWishlistUseCase.execute({
			userId,
			name: dto.name,
			isPrivate: dto.isPrivate,
		});
	}

	@Get(':id')
	@Auth(RoleEnum.CLIENTE)
	@ApiOperation({ summary: 'Obtener wishlist por id' })
	@ApiParam({ name: 'id', example: 'uuid-wishlist-id' })
	findOne(
		@Param('id', ParseUUIDPipe) id: string,
		@CurrentUser('id') userId: string,
	) {
		return this.getWishlistUseCase.execute({
			id,
			userId,
		});
	}

	@Delete(':id')
	@Auth(RoleEnum.CLIENTE)
	@ApiOperation({ summary: 'Eliminar wishlist' })
	@ApiParam({ name: 'id', example: 'uuid-wishlist-id' })
	@ApiResponse({ status: 200, description: 'Wishlist eliminada' })
	remove(
		@Param('id', ParseUUIDPipe) id: string,
		@CurrentUser('id') userId: string,
	) {
		return this.deleteWishlistUseCase.execute({
			id,
			userId,
		});
	}

	@Post('me/items')
	@Auth(RoleEnum.CLIENTE)
	@ApiOperation({
		summary:
			'Agregar producto a mi wishlist principal; si no existe se crea automáticamente',
	})
	addToMyWishlist(
		@Body() dto: AddWishlistItemDto,
		@CurrentUser('id') userId: string,
	) {
		return this.addProductToMyWishlistUseCase.execute({
			userId,
			productId: dto.productId,
		});
	}

	@Post(':wishlistId/items')
	@Auth(RoleEnum.CLIENTE)
	@ApiOperation({ summary: 'Agregar producto a wishlist existente' })
	@ApiParam({ name: 'wishlistId', example: 'uuid-wishlist-id' })
	addItem(
		@Param('wishlistId', ParseUUIDPipe) id: string,
		@Body() dto: AddWishlistItemDto,
		@CurrentUser('id') userId: string,
	) {
		return this.addItemUseCase.execute({
			wishlistId: id,
			productId: dto.productId,
			userId,
		});
	}

	@Delete(':id/items/:productId')
	@Auth(RoleEnum.CLIENTE)
	@ApiOperation({ summary: 'Eliminar producto de wishlist' })
	removeItem(
		@Param('id', ParseUUIDPipe) id: string,
		@Param('productId', ParseUUIDPipe) productId: string,
		@CurrentUser('id') userId: string,
	) {
		return this.removeItemUseCase.execute({
			id,
			productId,
			userId,
		});
	}

	@Post(':id/shares')
	@Auth(RoleEnum.CLIENTE)
	@ApiOperation({ summary: 'Compartir wishlist con otro usuario' })
	share(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: ShareWishlistDto,
		@CurrentUser('id') userId: string,
	) {
		return this.shareWishlistUseCase.execute({
			wishlistId: id,
			userId,
			sharedWithUserId: dto.sharedWithUserId,
		});
	}

	@Delete(':id/shares/:sharedWithUserId')
	@Auth(RoleEnum.CLIENTE)
	@ApiOperation({ summary: 'Revocar acceso compartido' })
	unshare(
		@Param('id', ParseUUIDPipe) id: string,
		@Param('sharedWithUserId', ParseUUIDPipe) sharedWithUserId: string,
		@CurrentUser('id') userId: string,
	) {
		return this.shareWishlistUseCase.execute({
			wishlistId: id,
			userId,
			sharedWithUserId,
		});
	}
}

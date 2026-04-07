import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { DeleteAccountUseCase } from 'src/application/use-cases/user/delete-account/delete-account.use-case';
import { GetProfileUseCase } from 'src/application/use-cases/user/get-profile/get-profile.use-case';
import { RegisterClientUseCase } from 'src/application/use-cases/user/register-client/register-client.use-case';
import { UpdatePasswordUseCase } from 'src/application/use-cases/user/update-password/update-password.use-case';
import { UpdateProfileUsecase } from 'src/application/use-cases/user/update-profile/update-profile.use-case';
import { RegisterDto } from '../dtos/user/register.dto';
import { UpdateProfileDto } from '../dtos/user/update-profile.dto';
import { UpdatePasswordDto } from '../dtos/user/update-password.dto';
import { FindEmailUseCase } from 'src/application/use-cases/user/find-email/find-email.use-case';
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
	constructor(
		private readonly registerClient: RegisterClientUseCase,
		private readonly getProfile: GetProfileUseCase,
		private readonly updateProfile: UpdateProfileUsecase,
		private readonly updatePassword: UpdatePasswordUseCase,
		private readonly deleteAccount: DeleteAccountUseCase,
		private readonly findEmail: FindEmailUseCase,
	) {}

	@Post('register')
	@ApiOperation({ summary: 'Registrar un nuevo usuario' })
	@ApiBody({ type: RegisterDto })
	@ApiResponse({ status: 201, description: 'Usuario creado correctamente' })
	register(@Body() dto: RegisterDto) {
		return this.registerClient.execute({
			name: dto.name,
			email: dto.email,
			phone: dto.phone,
			password: dto.password,
		});
	}

	@ApiBearerAuth()
	@Get('profile') // ← sin :id en la URL
	@UseGuards(JwtAuthGuard) // ← protege la ruta
	@ApiOperation({ summary: 'Obtener perfil de usuario' })
	@ApiResponse({ status: 200 })
	getProfiles(@CurrentUser('id') userId: string) {
		return this.getProfile.execute({ userId });
	}

	@Get('email/:email')
	@ApiOperation({ summary: 'Buscar usuario por email' })
	@ApiParam({
		name: 'email',
	})
	@ApiResponse({ status: 200, description: 'Resultado de búsqueda' })
	findEmails(@Param('email') email: string) {
		return this.findEmail.execute({ email });
	}

	@Patch('profile/:id')
	@ApiOperation({ summary: 'Actualizar perfil de usuario' })
	@ApiParam({ name: 'id', type: 'string', format: 'uuid' })
	@ApiBody({ type: UpdateProfileDto })
	@ApiResponse({ status: 200, description: 'Perfil actualizado' })
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: UpdateProfileDto,
	) {
		return this.updateProfile.execute({
			userId: id,
			name: dto.name,
			userName: dto.userName,
			phone: dto.phone,
		});
	}

	@Patch('password/:id')
	@ApiOperation({ summary: 'Actualizar contraseña' })
	@ApiParam({ name: 'id', type: 'string', format: 'uuid' })
	@ApiBody({ type: UpdatePasswordDto })
	@ApiResponse({ status: 200, description: 'Contraseña actualizada' })
	updatePasswords(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: UpdatePasswordDto,
	) {
		return this.updatePassword.execute({
			userId: id,
			currentPassword: dto.currentPassword,
			newPassword: dto.newPassword,
		});
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar cuenta de usuario' })
	@ApiParam({ name: 'id', type: 'string', format: 'uuid' })
	@ApiBody({
		schema: {
			example: { password: '12345678' },
		},
	})
	@ApiResponse({ status: 200, description: 'Cuenta eliminada' })
	delete(
		@Param('id', ParseUUIDPipe) id: string,
		@Body('password') password: string,
	) {
		return this.deleteAccount.execute({ userId: id, password });
	}
}

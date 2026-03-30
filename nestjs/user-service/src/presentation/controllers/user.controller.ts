import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
} from '@nestjs/common';
import { DeleteAccountUseCase } from 'src/application/use-cases/user/delete-account/delete-account.use-case';
import { GetProfileUseCase } from 'src/application/use-cases/user/get-profile/get-profile.use-case';
import { RegisterClientUseCase } from 'src/application/use-cases/user/register-client/register-client.use-case';
import { UpdatePasswordUseCase } from 'src/application/use-cases/user/update-password/update-password.use-case';
import { UpdateProfileUsecase } from 'src/application/use-cases/user/update-profile/update-profile.use-case';
import { RegisterDto } from '../dtos/user/register.dto';
import { UpdateProfileDto } from '../dtos/user/update-profile.dto';
import { UpdatePasswordDto } from '../dtos/user/update-password.dto';

@Controller('users')
export class UserController {
	constructor(
		private readonly registerClient: RegisterClientUseCase,
		private readonly getProfile: GetProfileUseCase,
		private readonly updateProfile: UpdateProfileUsecase,
		private readonly updatePassword: UpdatePasswordUseCase,
		private readonly deleteAccount: DeleteAccountUseCase,
	) {}

	@Post('register')
	register(@Body() dto: RegisterDto) {
		return this.registerClient.execute({
			name: dto.name,
			userName: dto.user_name,
			email: dto.email,
			phone: dto.phone,
			password: dto.password,
		});
	}

	@Get('profile/:id')
	getProfiles(@Param('id', ParseUUIDPipe) id: string) {
		return this.getProfile.execute({ userId: id });
	}

	@Patch('profile/:id')
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
	delete(
		@Param('id', ParseUUIDPipe) id: string,
		@Body('password') password: string,
	) {
		return this.deleteAccount.execute({ userId: id, password });
	}
}

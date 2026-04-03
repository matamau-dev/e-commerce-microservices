import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ForgotPasswordUseCase } from 'src/application/use-cases/password/forgot-password/forgot-password.use-case';
import { ResetPasswordUseCase } from 'src/application/use-cases/password/reset-password/reset-password.use-case';
import { ForgotPasswordDto } from '../dtos/password/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/password/reset-password.dto';

@Controller('password')
@UseGuards(ThrottlerGuard)
export class PasswordController {
	constructor(
		private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
		private readonly resetPasswordUseCase: ResetPasswordUseCase,
	) {}

	@Post('forgot')
	async forgotPassword(@Body() dto: ForgotPasswordDto) {
		return this.forgotPasswordUseCase.execute({
			email: dto.email,
		});
	}

	@Post('reset')
	async resetPassword(@Body() dto: ResetPasswordDto) {
		return this.resetPasswordUseCase.execute({
			resetToken: dto.resetToken,
			newPassword: dto.newPassword,
		});
	}
}

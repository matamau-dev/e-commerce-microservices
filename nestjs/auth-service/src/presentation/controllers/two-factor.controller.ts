import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { EnableTotpUseCase } from 'src/application/use-cases/two-factor/enable-totp/enable-totp.use-case';
import { VerifyTotpUseCase } from 'src/application/use-cases/two-factor/verify-totp/verify-totp.use-case';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('two-factor')
@UseGuards(ThrottlerGuard)
export class TwoFactorController {
	constructor(
		private readonly enableTotp: EnableTotpUseCase,
		private readonly verifyTotp: VerifyTotpUseCase,
	) {}

	@Post('enable-totp')
	enableTotpForUser(@CurrentUser('id') userId: string) {
		return this.enableTotp.execute({ userId });
	}

	@Post('verify-totp')
	verifyTotpForUser(
		@CurrentUser('id') userId: string,
		@Body('code') code: string,
	) {
		return this.verifyTotp.execute({
			userId,
			code,
			isLoginVerification: false,
		});
	}
}

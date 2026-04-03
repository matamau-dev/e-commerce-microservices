import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface UserResponse {
	id: string;
	email: string;
	password: string;
	role: string;
	isActive: boolean;
}

@Injectable()
export class UserServiceClient {
	private readonly baseUrl: string;

	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService,
	) {
		this.baseUrl = this.configService.getOrThrow('userServiceUrl.url');
	}

	async findByEmail(email: string): Promise<UserResponse | null> {
		try {
			const { data } = await firstValueFrom(
				this.httpService.get(
					`${this.baseUrl}/users/internal/by-email/${email}`,
				),
			);
			return data;
		} catch {
			return null;
		}
	}

	async resetPassword(input: {
		resetToken: string;
		newPassword: string;
	}): Promise<{ success: boolean; userId: string }> {
		try {
			const { data } = await firstValueFrom(
				this.httpService.post(
					`${this.baseUrl}/users/internal/reset-password`,
					input,
				),
			);
			return data;
		} catch {
			return { success: false, userId: '' };
		}
	}
}

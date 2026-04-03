import { applyDecorators, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RoleEnum } from '../../domain/enums/role.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';

export const Auth = (...roles: RoleEnum[]) =>
	applyDecorators(
		Roles(...roles),
		UseGuards(ThrottlerGuard, JwtAuthGuard, RolesGuard),
	);

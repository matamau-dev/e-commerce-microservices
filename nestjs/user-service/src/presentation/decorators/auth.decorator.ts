import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/domain/enums/role.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export const Auth = (...roles: RoleEnum[]) =>
	applyDecorators(
		SetMetadata('roles', roles),
		UseGuards(JwtAuthGuard, RolesGuard),
	);

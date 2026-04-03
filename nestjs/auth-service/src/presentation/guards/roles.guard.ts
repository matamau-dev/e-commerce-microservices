import {
	CanActivate,
	ExecutionContext,
	Injectable,
	ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum, RoleHierarchy } from '../../domain/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.get<RoleEnum[]>(
			'roles',
			context.getHandler(),
		);

		// Sin roles requeridos — ruta pública
		if (!requiredRoles?.length) return true;

		const { user } = context.switchToHttp().getRequest();
		if (!user) throw new ForbiddenException('Sin autorización');

		const userLevel = RoleHierarchy[user.role as RoleEnum] ?? 0;
		const requiredLevel = Math.min(
			...requiredRoles.map((r) => RoleHierarchy[r]),
		);

		if (userLevel < requiredLevel) {
			throw new ForbiddenException('No tienes permisos suficientes');
		}

		return true;
	}
}

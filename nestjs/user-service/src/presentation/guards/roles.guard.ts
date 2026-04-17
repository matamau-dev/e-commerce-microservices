import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RoleEnum, RoleHierarchy } from 'src/domain/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.get<RoleEnum[]>(
			'roles',
			context.getHandler(),
		);

		if (!requiredRoles?.length) return true;

		const { user } = context.switchToHttp().getRequest();
		if (!user) throw new ForbiddenException('Sin autorización');
		const userLevel = RoleHierarchy[user.role as RoleEnum] ?? 0;
		const requiredLevel = Math.min(
			...requiredRoles.map((r) => RoleHierarchy[r]),
		);
		if (userLevel >= requiredLevel) return true;

		throw new ForbiddenException(
			`Se requiere rol mínimo: ${requiredRoles.join(' o ')}`,
		);
	}
}

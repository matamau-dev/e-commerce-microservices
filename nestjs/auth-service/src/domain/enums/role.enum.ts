export enum RoleEnum {
	SUPER_ADMIN = 'super_admin',
	ADMIN = 'admin',
	SUPERVISOR = 'supervisor',
	VENDEDOR = 'vendedor',
	COMPRADOR = 'comprador',
}

export const RoleHierarchy: Record<RoleEnum, number> = {
	[RoleEnum.SUPER_ADMIN]: 5,
	[RoleEnum.ADMIN]: 4,
	[RoleEnum.SUPERVISOR]: 3,
	[RoleEnum.VENDEDOR]: 2,
	[RoleEnum.COMPRADOR]: 1,
};

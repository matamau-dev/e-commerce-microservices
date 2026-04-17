export enum RoleEnum {
	SUPER_ADMIN = 'super_admin',
	ADMIN = 'admin',
	SUPERVISOR = 'supervisor',
	CLIENTE = 'cliente',
}

export const RoleHierarchy: Record<RoleEnum, number> = {
	[RoleEnum.SUPER_ADMIN]: 5,
	[RoleEnum.ADMIN]: 4,
	[RoleEnum.SUPERVISOR]: 3,
	[RoleEnum.CLIENTE]: 2,
};

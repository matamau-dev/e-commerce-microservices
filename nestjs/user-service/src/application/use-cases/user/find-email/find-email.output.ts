import { RoleEnum } from 'src/domain/enums/role.enum';

export interface FindEmailOutput {
	id: string;
	email: string;
	password: string; // hasheado — Auth MS compara con argon2.verify()
	role: RoleEnum; // para incluirlo en el JWT
	isActive: boolean; // para verificar que la cuenta no está suspendida
}

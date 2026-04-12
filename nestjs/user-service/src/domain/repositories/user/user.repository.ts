import { User } from '../../entities/user/user.entity';

export interface UserReader {
	findById(id: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
}

export interface UserWriter {
	create(user: User): Promise<User>;
	update(user: User): Promise<User>;
	softDelete(id: string): Promise<void>;
	permanentDelete(id: string): Promise<void>;
}

export interface UserVerification {
	existByEmail(email: string): Promise<boolean>;
	existByPhone(phone: string): Promise<boolean>;
}

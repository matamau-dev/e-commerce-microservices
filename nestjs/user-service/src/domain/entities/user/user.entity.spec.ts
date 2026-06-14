import { User } from './user.entity';
import { RoleEnum } from '../../enums/role.enum';
import { Email } from '../../value-objects/user/email.value-object';
import { PhoneNumber } from '../../value-objects/utils/phone.value-object';
import { SamePhoneException } from 'src/domain/exceptions/user/same-phone.exception';

const makeUser = (
	overrides?: Partial<{
		name: string;
		email: string;
		phone: string;
		role: RoleEnum;
	}>,
) =>
	User.create({
		name: overrides?.name ?? 'Juan Pérez',
		email: new Email(overrides?.email ?? 'juan@gmail.com'),
		phone: PhoneNumber.create(overrides?.phone ?? '9611234567'),
		password: 'hashed_password_123',
		role: overrides?.role ?? RoleEnum.CLIENTE,
	});

describe('User Entity', () => {
	describe('create', () => {
		it('should create a valid user instance with default active state and empty address list', () => {
			const user = makeUser();

			expect(user.id).toBeDefined();
			expect(user.name).toBe('Juan Pérez');
			expect(user.email.getValue()).toBe('juan@gmail.com');
			expect(user.isActive).toBe(true);
			expect(user.deletedAt).toBeUndefined();
			expect(user.addresses).toEqual([]);
			expect(user.createdAt).toBeInstanceOf(Date);
		});

		it('should generate a unique UUID for each new user', () => {
			const user1 = makeUser();
			const user2 = makeUser();

			expect(user1.id).not.toBe(user2.id);
		});

		it('should normalize the name by trimming leading and trailing whitespaces', () => {
			const user = makeUser({ name: ' Juan Pérez ' });

			expect(user.name).toBe('Juan Pérez');
		});

		it('should initialize the user as active by default', () => {
			const user = makeUser();

			expect(user.isActive).toBe(true);
		});
	});

	describe('changeName', () => {
		it('should update the name correctly', () => {
			const user = makeUser();
			user.changeName('Carlos Gómez');

			expect(user.name).toBe('Carlos Gómez');
		});

		it('should update the updatedAt date when the name is modified', () => {
			const user = makeUser();

			expect(user.updatedAt).toBeUndefined();

			user.changeName('Pedro López');

			expect(user.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when the new name is empty', () => {
			const user = makeUser();

			expect(() => user.changeName('')).toThrow('Name is required');
		});

		it('should throw an error when the new name consists only of whitespace', () => {
			const user = makeUser();

			expect(() => user.changeName('   ')).toThrow('Name is required');
		});
	});

	describe('changePhone', () => {
		it('should update the phone number correctly', () => {
			const user = makeUser();
			const newPhone = PhoneNumber.create('9619876543');
			user.changePhone(newPhone);

			expect(user.phone.getValue()).toBe('9619876543');
		});

		it('should throw SamePhoneException when setting the exact same phone instance', async () => {
			const user = makeUser();
			const samePhone = user.phone;

			await expect((async () => user.changePhone(samePhone))()).rejects.toThrow(SamePhoneException);
		});

		it('should update the updatedAt date when the phone number is changed', () => {
			const user = makeUser();
			user.changePhone(PhoneNumber.create('9619876543'));

			expect(user.updatedAt).toBeInstanceOf(Date);
		});
	});

	describe('changePassword', () => {
		it('should update the hashed password', () => {
			const user = makeUser();
			user.changePassword('new_hashed_password');

			expect(user.password).toBe('new_hashed_password');
		});

		it('should update the updatedAt date when the password is changed', () => {
			const user = makeUser();
			user.changePassword('new_hashed_password');

			expect(user.updatedAt).toBeInstanceOf(Date);
		});
	});

	describe('activate and deactivate', () => {
		it('should deactivate an active user', () => {
			const user = makeUser();

			expect(user.isActive).toBe(true);

			user.deactivate();

			expect(user.isActive).toBe(false);
		});

		it('should activate a deactivated user', () => {
			const user = makeUser();
			user.deactivate();
			user.activate();

			expect(user.isActive).toBe(true);
		});

		it('should update the updatedAt date when activating the user', () => {
			const user = makeUser();
			user.activate();

			expect(user.updatedAt).toBeInstanceOf(Date);
		});

		it('should update the updatedAt date when deactivating the user', () => {
			const user = makeUser();
			user.deactivate();

			expect(user.updatedAt).toBeInstanceOf(Date);
		});
	});

	describe('softDelete', () => {
		it('should set deletedAt date when performing soft delete', () => {
			const user = makeUser();

			expect(user.deletedAt).toBeUndefined();

			user.softDelete();

			expect(user.deletedAt).toBeInstanceOf(Date);
		});

		it('should update the updatedAt date when performing soft delete', () => {
			const user = makeUser();
			user.softDelete();

			expect(user.updatedAt).toBeInstanceOf(Date);
		});

		it('should keep other properties unchanged after soft delete', () => {
			const user = makeUser();
			const nameBefore = user.name;
			user.softDelete();

			expect(user.name).toBe(nameBefore);
			expect(user.email.getValue()).toBe('juan@gmail.com');
		});
	});
});

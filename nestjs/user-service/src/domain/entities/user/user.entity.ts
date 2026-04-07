import { RoleEnum } from 'src/domain/enums/role.enum';
import { Email } from 'src/domain/value-objects/email.value-object';
import { Phone } from 'src/domain/value-objects/phone.value-object';

export class User {
	id!: string;
	name!: string;
	email!: Email;
	phone!: Phone;
	password!: string;
	role!: RoleEnum;
	isActive!: boolean;
	deletedAt?: Date;
	createdAt!: Date;
}

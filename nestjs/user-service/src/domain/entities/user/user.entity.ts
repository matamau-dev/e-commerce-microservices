import { RoleEnum } from 'src/domain/enums/role.enum';
import { ProfileImage } from '../image_user/profile-image.entity';
import { Address } from '../address/address.entity';
import { PhoneNumber } from 'src/domain/value-objects/utils/phone.value-object';
import { Email } from 'src/domain/value-objects/user/email.value-object';

export class User {
	id!: string;
	name!: string;
	email!: Email;
	phone!: PhoneNumber;
	password!: string;
	role!: RoleEnum;
	isActive!: boolean;
	addresses?: Address[];
	profileImages?: ProfileImage;
	deletedAt?: Date;
	createdAt!: Date;
}

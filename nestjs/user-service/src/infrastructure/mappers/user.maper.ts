import { User } from 'src/domain/entities/user/user.entity';
import { UserOrmEntity } from '../database/postgres/orm-entities/user.orm-entity';
import { AddressMapper } from './address.maper';
import { FileMapper } from './file.mapper';

export class UserMapper {
	private constructor() {}

	static UserOrmToUserDomain(orm: UserOrmEntity): User {
		return User.fromPersistence({
			id: orm.id,
			name: orm.name,
			role: orm.role,
			password: orm.password,
			email: orm.email,
			phone: orm.phone,
			isActive: orm.isActive,
			addresses:
				orm.addresses?.map((address) =>
					AddressMapper.AddressORMtoAddressDomain(address),
				) ?? [],
			profileImages: orm.profileImages
				? FileMapper.FileOrmToFileDomain(orm.profileImages)
				: undefined,
			createdAt: orm.createdAt,
			updatedAt: orm.updatedAt,
		});
	}

	static UserDomainToUserORM(user: User): Partial<UserOrmEntity> {
		return {
			id: user.id,
			name: user.name,
			email: user.email.getValue(),
			phone: user.phone.getValue(),
			password: user.password,
			role: user.role,
			isActive: user.isActive,
			deletedAt: user.deletedAt,
		};
	}
}

import { ProfileImage } from 'src/domain/entities/image_user/profile-image.entity';
import { FilesOrmEntity } from '../database/postgres/orm-entities/file.orm-entity';

export class FileMapper {
	private constructor() {}

	static FileOrmToFileDomain(orm: FilesOrmEntity): ProfileImage {
		return ProfileImage.fromPersistence({
			id: orm.id,
			url: orm.url,
			nameOriginal: orm.nameOriginal,
			typeFile: orm.typeFile,
			userId: orm.userId,
			createdAt: orm.createdAt,
		});
	}

	static FileDomainToFileOrm(domain: ProfileImage): FilesOrmEntity {
		const orm = new FilesOrmEntity();
		orm.id = domain.id;
		orm.url = domain.url;
		orm.nameOriginal = domain.nameOriginal;
		orm.typeFile = domain.typeFile;
		orm.userId = domain.userId;
		orm.createdAt = domain.createdAt;
		return orm;
	}
}

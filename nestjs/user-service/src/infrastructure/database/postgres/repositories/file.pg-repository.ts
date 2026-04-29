import { ProfileImage } from 'src/domain/entities/image_user/profile-image.entity';
import {
	ProfileImageReader,
	ProfileImageWriter,
} from 'src/domain/repositories/image_user/profile-image.repository';
import { FilesOrmEntity } from '../orm-entities/file.orm-entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class FilePgRepository
	implements ProfileImageReader, ProfileImageWriter
{
	constructor(
		@InjectRepository(FilesOrmEntity)
		private readonly fileRepository: Repository<FilesOrmEntity>,
	) {}

	async findByUserId(userId: string): Promise<ProfileImage | null> {
		const found = await this.fileRepository.findOne({
			where: { user: { id: userId } },
		});
		return found ? this.toDomain(found) : null;
	}

	async save(image: ProfileImage): Promise<ProfileImage> {
		const saved = await this.fileRepository.save(this.toOrm(image));
		return this.toDomain(saved);
	}

	async update(image: ProfileImage): Promise<ProfileImage> {
		const updated = await this.fileRepository.save(this.toOrm(image));
		return this.toDomain(updated);
	}

	deleteByUserId(userId: string): Promise<void> {
		return this.fileRepository
			.delete({ user: { id: userId } })
			.then(() => undefined);
	}

	private toDomain(orm: FilesOrmEntity): ProfileImage {
		const domain = new ProfileImage();
		domain.id = orm.id;
		domain.url = orm.url;
		domain.nameOriginal = orm.nameOriginal;
		domain.typeFile = orm.typeFile;
		domain.userId = orm.userId;
		domain.createdAt = orm.createdAt;
		return domain;
	}

	private toOrm(domain: ProfileImage): FilesOrmEntity {
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

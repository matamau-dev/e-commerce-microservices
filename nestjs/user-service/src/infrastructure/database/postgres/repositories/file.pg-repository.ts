import { ProfileImage } from 'src/domain/entities/image_user/profile-image.entity';
import {
	ProfileImageReader,
	ProfileImageWriter,
} from 'src/domain/repositories/image_user/profile-image.repository';
import { FilesOrmEntity } from '../orm-entities/file.orm-entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileMapper } from 'src/infrastructure/mappers/file.mapper';

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
		return found ? FileMapper.FileOrmToFileDomain(found) : null;
	}

	async save(image: ProfileImage): Promise<ProfileImage> {
		const saved = await this.fileRepository.save(
			FileMapper.FileDomainToFileOrm(image),
		);
		return FileMapper.FileOrmToFileDomain(saved);
	}

	async update(image: ProfileImage): Promise<ProfileImage> {
		const updated = await this.fileRepository.save(
			FileMapper.FileDomainToFileOrm(image),
		);
		return FileMapper.FileOrmToFileDomain(updated);
	}

	deleteByUserId(userId: string): Promise<void> {
		return this.fileRepository
			.delete({ user: { id: userId } })
			.then(() => undefined);
	}
}

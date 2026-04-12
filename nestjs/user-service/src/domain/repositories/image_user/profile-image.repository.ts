import { ProfileImage } from 'src/domain/entities/image_user/profile-image.entity';

export interface ProfileImageReader {
	findByUserId(userId: string): Promise<ProfileImage | null>;
}

export interface ProfileImageWriter {
	save(image: ProfileImage): Promise<ProfileImage>;
	update(image: ProfileImage): Promise<ProfileImage>;
	deleteByUserId(userId: string): Promise<void>;
}

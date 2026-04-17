// src/app.module.ts
import { Module } from '@nestjs/common';
import { UserModule } from './module/user/user.module';
import { ProfileModule } from './module/profile/profile.module';

@Module({
	imports: [UserModule, ProfileModule],
})
export class UserServiceModule {}

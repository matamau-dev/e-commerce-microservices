// src/app.module.ts
import { Module } from '@nestjs/common';
import { UserModule } from './module/user/user.module';

@Module({
	imports: [UserModule],
})
export class UserServiceModule {}

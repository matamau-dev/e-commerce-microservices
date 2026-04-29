// src/app.module.ts
import { Module } from '@nestjs/common';
import { UserModule } from './module/user/user.module';
import { ProfileModule } from './module/profile/profile.module';
import { AddressModule } from './module/address/address.module';
import { WishlistModule } from './module/whislist/whislist.module';

@Module({
	imports: [UserModule, ProfileModule, AddressModule, WishlistModule],
})
export class UserServiceModule {}

import { ApiProperty } from '@nestjs/swagger';
import {
	IsString,
	IsEmail,
	IsNotEmpty,
	Length,
	Matches,
} from 'class-validator';
import { Exclude } from 'class-transformer';

export class RegisterDto {
	@ApiProperty({
		description: 'Full name of the user',
		example: 'Juan Pérez',
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({ description: 'Username for login', example: 'juanp' })
	@IsString()
	@IsNotEmpty()
	user_name: string;

	@ApiProperty({
		description: 'Email address of the user',
		example: 'juan@example.com',
	})
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		description: 'Phone number of the user',
		example: '+5215512345678',
	})
	@IsString()
	@IsNotEmpty()
	phone: string;

	@ApiProperty({
		description:
			'Password for the user (8-32 chars, 1 uppercase, 1 lowercase, 1 number)',
		example: 'Password123',
	})
	@IsString()
	@IsNotEmpty()
	@Length(8, 32)
	@Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, {
		message:
			'Password must contain at least 1 uppercase, 1 lowercase and 1 number',
	})
	@Exclude({ toPlainOnly: true })
	password: string;
}

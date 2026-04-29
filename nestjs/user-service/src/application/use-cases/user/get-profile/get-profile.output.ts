export interface GetProfileOutput {
	id: string;
	name: string;
	email: string;
	phone: string;
	isActive: boolean;
	createdAt: Date;
	profileImage?: {
		url: string;
		type: string;
	} | null;
}

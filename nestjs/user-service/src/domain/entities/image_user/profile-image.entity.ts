export class ProfileImage {
	private constructor(
		public readonly id: string,
		private _url: string,
		private _nameOriginal: string,
		private _typeFile: string,
		public readonly userId: string,
		public readonly createdAt: Date,
	) {}

	static create(input: {
		userId: string;
		url: string;
		nameOriginal: string;
		typeFile: string;
	}): ProfileImage {
		return new ProfileImage(
			crypto.randomUUID(),
			input.url,
			input.nameOriginal,
			input.typeFile,
			input.userId,
			new Date(),
		);
	}

	static fromPersistence(input: {
		id: string;
		url: string;
		nameOriginal: string;
		typeFile: string;
		userId: string;
		createdAt: Date;
	}): ProfileImage {
		return new ProfileImage(
			input.id,
			input.url,
			input.nameOriginal,
			input.typeFile,
			input.userId,
			input.createdAt,
		);
	}

	get url(): string {
		return this._url;
	}

	get nameOriginal(): string {
		return this._nameOriginal;
	}

	get typeFile(): string {
		return this._typeFile;
	}

	changeFile(input: {
		url: string;
		nameOriginal: string;
		typeFile: string;
	}): void {
		this._url = input.url;
		this._nameOriginal = input.nameOriginal;
		this._typeFile = input.typeFile;
	}
}

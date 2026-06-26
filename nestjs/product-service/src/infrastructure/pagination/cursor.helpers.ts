export function encodeBase64(input: string): string {
	return Buffer.from(input).toString('base64');
}

export function decodeBase64(input: string): string {
	return Buffer.from(input, 'base64').toString('utf-8');
}

export function decodeCursor(cursor: string): Date {
	const decoded = decodeBase64(cursor);
	const date = new Date(decoded);
	// if (isNaN(date.getTime())) throw new InvalidCursorException();
	return date;
}

export function encodeCursor(date: Date): string {
	return encodeBase64(date.toISOString());
}

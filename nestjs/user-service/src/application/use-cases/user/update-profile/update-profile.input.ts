export interface UpdateProfileInput {
	userId: string;
	name?: string;
	userName?: string;
	phone?: string;
	// email y password no van aquí — tienen su propio caso de uso
	// porque cambiarlos requiere verificación extra
}

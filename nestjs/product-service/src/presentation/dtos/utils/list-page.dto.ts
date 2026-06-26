import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListPageDto {
	@ApiPropertyOptional({
		description: 'Cantidad de resultados a retornar',
		example: 10,
		minimum: 1,
		maximum: 50,
		default: 10,
	})
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	@Max(50)
	limit?: number;

	@ApiPropertyOptional({
		description: 'Cursor para obtener la siguiente página (base64)',
		example: 'eyJpZCI6IjEyMyJ9',
	})
	@IsOptional()
	@IsString()
	nextCursor?: string;

	@ApiPropertyOptional({
		description: 'Cursor para obtener la página anterior (base64)',
		example: 'eyJpZCI6IjEyMyJ9',
	})
	@IsOptional()
	@IsString()
	prevCursor?: string;
}

import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TransactionManager } from '../../../domain/transaction/transaction-manager.interface';

@Injectable()
export class TypeormTransactionManager implements TransactionManager {
	constructor(private readonly dataSource: DataSource) {}

	async run<T>(work: () => Promise<T>): Promise<T> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const result = await work();
			await queryRunner.commitTransaction();
			return result;
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}
}

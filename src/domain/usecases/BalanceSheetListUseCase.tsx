import { ReportRepository } from '../repositories/ReportRepository';
import { ListReportsResponse, ListBalanceSheetsParams } from '../entities/ReportEntities';

export class ListBalanceSheetUseCase {
  constructor(private readonly repository: ReportRepository) {}

  async execute(params?: ListBalanceSheetsParams): Promise<ListReportsResponse> {
    return this.repository.listBalanceSheets(params);
  }
}

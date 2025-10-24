import { ReportRepository } from '../repositories/ReportRepository';

export class ListCashFlowStatementsUseCase {
  constructor(private repository: ReportRepository) {}

  async execute() {
    return this.repository.listCashFlowStatements();
  }
}

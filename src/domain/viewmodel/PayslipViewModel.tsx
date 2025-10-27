import { useState, useCallback, useMemo } from 'react';
import { CreatePayslipUseCase } from '../usecases/CreatePayslipUseCase';
import { CreatePayslipRequest, CreatePayslipResponse } from '../entities/PayslipEntities';

export class PayslipViewModel {
  constructor(
    private createPayslipUseCase: CreatePayslipUseCase
  ) {}

  async createPayslip(request: CreatePayslipRequest): Promise<CreatePayslipResponse> {
    return await this.createPayslipUseCase.execute(request);
  }
}

export const usePayslipViewModel = (
  createPayslipUseCase: CreatePayslipUseCase
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const viewModel = useMemo(() => new PayslipViewModel(createPayslipUseCase), [createPayslipUseCase]);

  const createPayslip = useCallback(async (request: CreatePayslipRequest): Promise<CreatePayslipResponse> => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await viewModel.createPayslip(request);
      
      if (response.success) {
        setSuccess(response.message || 'Payslip created successfully');
      } else {
        setError(response.error || 'Failed to create payslip');
      }
      
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, [viewModel]);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    createPayslip,
    isLoading,
    error,
    success,
    clearMessages
  };
};

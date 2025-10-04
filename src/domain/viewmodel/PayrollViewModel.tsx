// src/domain/viewmodel/PayrollViewModel.tsx
import { useState } from 'react';
import { CreatePayrollEntryUseCase, CreatePayrollEntryUseCaseResponse } from '../usecases/CreatePayrollEntryUseCase';
import { ProcessPayrollPaymentUseCase } from '../usecases/ProcessPayrollPaymentUseCase';
import { 
  CreatePayrollEntryRequest, 
  ProcessPayrollPaymentRequest,
  ProcessPayrollPaymentResponse 
} from '../entities/PayrollEntities';

// Hook-based version for React components
export const usePayrollViewModel = (
  createPayrollEntryUseCase: CreatePayrollEntryUseCase,
  processPayrollPaymentUseCase: ProcessPayrollPaymentUseCase
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const createPayrollEntry = async (request: CreatePayrollEntryRequest): Promise<CreatePayrollEntryUseCaseResponse> => {
    try {
      setIsLoading(true);
      clearMessages();
      
      console.log('🔄 Creating payroll entry:', request);
      const response = await createPayrollEntryUseCase.execute(request);
      
      if (response.success) {
        setSuccess(response.message || 'Payroll entry created successfully!');
        console.log('✅ Payroll entry created:', response);
      } else {
        setError(response.error || 'Failed to create payroll entry');
        console.error('❌ Payroll entry creation failed:', response);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('❌ Payroll entry creation error:', err);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const processPayrollPayment = async (request: ProcessPayrollPaymentRequest): Promise<ProcessPayrollPaymentResponse> => {
    try {
      setIsLoading(true);
      clearMessages();
      
      console.log('🔄 Processing payroll payment:', request);
      const response = await processPayrollPaymentUseCase.execute(request);
      
      if (response.success) {
        setSuccess(response.message || 'Payroll payment processed successfully!');
        console.log('✅ Payroll payment processed:', response);
      } else {
        setError(response.error || 'Failed to process payroll payment');
        console.error('❌ Payroll payment processing failed:', response);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('❌ Payroll payment processing error:', err);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    success,
    clearMessages,
    createPayrollEntry,
    processPayrollPayment
  };
};

export class PayrollViewModel {
  constructor(
    private createPayrollEntryUseCase: CreatePayrollEntryUseCase,
    private processPayrollPaymentUseCase: ProcessPayrollPaymentUseCase
  ) {}

  async createPayrollEntry(request: CreatePayrollEntryRequest): Promise<CreatePayrollEntryUseCaseResponse> {
    try {
      console.log('🔄 Creating payroll entry:', request);
      const response = await this.createPayrollEntryUseCase.execute(request);
      
      if (response.success) {
        console.log('✅ Payroll entry created:', response);
      } else {
        console.error('❌ Payroll entry creation failed:', response);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('❌ Payroll entry creation error:', err);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  async processPayrollPayment(request: ProcessPayrollPaymentRequest): Promise<ProcessPayrollPaymentResponse> {
    try {
      console.log('🔄 Processing payroll payment:', request);
      const response = await this.processPayrollPaymentUseCase.execute(request);
      
      if (response.success) {
        console.log('✅ Payroll payment processed:', response);
      } else {
        console.error('❌ Payroll payment processing failed:', response);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('❌ Payroll payment processing error:', err);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }
}

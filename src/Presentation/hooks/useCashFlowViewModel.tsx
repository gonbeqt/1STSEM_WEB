import { useRef } from 'react';
import { container } from '../../di/container';
import { CashFlowListViewModel } from '../../domain/viewmodel/CashFlowListViewModel';

let cachedViewModel: CashFlowListViewModel | null = null;

export const useCashFlowListViewModel = (): CashFlowListViewModel => {
  const viewModelRef = useRef<CashFlowListViewModel | null>(null);

  if (!viewModelRef.current) {
    if (!cachedViewModel) {
      cachedViewModel = new CashFlowListViewModel((container as any).listCashFlowStatementsUseCase);
    }
    viewModelRef.current = cachedViewModel;
  }

  return viewModelRef.current;
};

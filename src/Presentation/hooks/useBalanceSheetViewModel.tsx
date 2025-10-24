import { useRef } from 'react';
import { container } from '../../di/container';
import { BalanceSheetViewModel } from '../../domain/viewmodel/BalanceSheetViewModel';
import { BalanceSheetListViewModel } from '../../domain/viewmodel/BalanceSheetListViewModel';
import { IncomeViewModel } from '../../domain/viewmodel/IncomeViewModel';

export const useBalanceSheetViewModel = (): BalanceSheetViewModel => {
  const viewModelRef = useRef<BalanceSheetViewModel>();

  if (!viewModelRef.current) {
    viewModelRef.current = container.balanceSheetViewModel();
  }

  return viewModelRef.current!;
};

export const useBalanceSheetListViewModel = (): BalanceSheetListViewModel => {
  const viewModelRef = useRef<BalanceSheetListViewModel>();

  if (!viewModelRef.current) {
    viewModelRef.current = container.balanceSheetListViewModel();
  }

  return viewModelRef.current!;
};

export const useIncomeViewModel = (): IncomeViewModel => {
  const viewModelRef = useRef<IncomeViewModel>();

  if (!viewModelRef.current) {
    viewModelRef.current = container.incomeViewModel();
  }

  return viewModelRef.current!;
};

import { useRef } from 'react';
import { container } from '../../di/container';
import { InvestmentReportViewModel } from '../../domain/viewmodel/InvestmentReportViewModel';

export const useInvestmentReport = (): InvestmentReportViewModel => {
  const viewModelRef = useRef<InvestmentReportViewModel>();

  if (!viewModelRef.current) {
    viewModelRef.current = container.investmentReportViewModel();
  }

  return viewModelRef.current!;
};

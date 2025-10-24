import { useMemo } from 'react';
import { container } from '../../di/container';

export const useTaxSummaryViewModel = () => {
  const viewModel = useMemo(() => container.taxSummaryViewModel(), []);
  return viewModel;
};

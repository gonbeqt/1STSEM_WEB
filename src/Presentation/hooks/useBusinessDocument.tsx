import { useContext } from 'react';
import { BusinessDocumentViewModel } from '../../domain/viewmodel/BusinessDocumentViewModel';
import { BusinessDocumentViewModelContext } from '../../context/BusinessDocumentViewModelContext';

export const useBusinessDocument = (): BusinessDocumentViewModel => {
  const businessDocumentViewModel = useContext(BusinessDocumentViewModelContext);
  if (!businessDocumentViewModel) {
    throw new Error('useBusinessDocument must be used within a BusinessDocumentViewModelProvider');
  }
  return businessDocumentViewModel;
};

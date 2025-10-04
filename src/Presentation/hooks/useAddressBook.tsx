import { useRef } from 'react';
import { container } from '../../di/container';
import { AddressBookViewModel } from '../../domain/viewmodel/AddressBookViewModel';

export const useAddressBook = (): AddressBookViewModel => {
  const viewModelRef = useRef<AddressBookViewModel>();
  
  if (!viewModelRef.current) {
    viewModelRef.current = container.addressBookViewModel();
  }
  
  return viewModelRef.current;
};

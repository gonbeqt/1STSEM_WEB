import { useRef } from 'react';
import { container } from '../../di/container';
import { RegisterViewModel } from '../../domain/viewmodel/RegisterViewModel';
import { LoginViewModel } from '../../domain/viewmodel/LoginViewModel';

export function useViewModel<T>(ViewModelClass: new (...args: any[]) => T): T {
  const viewModelRef = useRef<T>();
  
  if (!viewModelRef.current) {
    if (ViewModelClass === RegisterViewModel) {
      viewModelRef.current = container.registerViewModel() as T;
    } else if (ViewModelClass === LoginViewModel) {
      viewModelRef.current = container.loginViewModel() as T;
    } 
  }
  
  return viewModelRef.current!;
}
import React, { createContext } from 'react';
import { BusinessDocumentViewModel } from '../domain/viewmodel/BusinessDocumentViewModel';

export const BusinessDocumentViewModelContext = createContext<BusinessDocumentViewModel | null>(null);

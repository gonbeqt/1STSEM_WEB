// src/data/repositories/SendETHRepository.tsx

import { SendETHRequest, SendETHResponse } from '../../domain/entities/SendEthEntities';

export interface SendETHRepository {
  sendETH(request: SendETHRequest): Promise<SendETHResponse>;
}

import { SendETHRequest, SendETHResponse } from '../entities/SendEthEntities';

export interface SendETHRepository {
  sendETH(request: SendETHRequest): Promise<SendETHResponse>;
}
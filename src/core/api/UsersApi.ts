import { ApiBase } from './ApiBase';
import { APIResponse, expect } from '@playwright/test';
import { CommunicationChannel, UpdateChannelsPayload } from './types';

export class UsersApi extends ApiBase {

  /**
   * MYM-135: Update Communication Channels
   */
  async updateCommunicationChannels(channels: CommunicationChannel[]): Promise<[APIResponse, CommunicationChannel[], UpdateChannelsPayload]> {
    const payload: UpdateChannelsPayload = { channels };
    const [response, body, sentPayload] = await this.apiPUT<CommunicationChannel[], UpdateChannelsPayload>(
      '/api/users/me/communication-channels', 
      payload
    );

    expect(response.status()).toBe(200);
    return [response, body, sentPayload];
  }
}

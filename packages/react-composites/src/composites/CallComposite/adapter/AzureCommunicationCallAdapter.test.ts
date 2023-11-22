// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(calling-sounds) */
import {
  CommonCallAdapterOptions,
  createAzureCommunicationCallAdapterFromClient
} from './AzureCommunicationCallAdapter';
/* @conditional-compile-remove(calling-sounds) */
import { MockCallAgent, MockCallClient } from '../../CallWithChatComposite/adapter/TestUtils';
/* @conditional-compile-remove(calling-sounds) */
import { StatefulCallClient } from '@internal/calling-stateful-client';

describe('Adapter is created as expected', () => {
  test('test to fulfill no empty test runners', () => {
    expect(true).toBeTruthy();
  });
  /* @conditional-compile-remove(calling-sounds) */
  test('when cerating an adapter without sounds provided we should not see it in state', async () => {
    const mockCallClient = new MockCallClient() as unknown as StatefulCallClient;

    const mockCallAgent = new MockCallAgent();
    const locator = { participantIds: ['some user id'] };

    const adapter = await createAzureCommunicationCallAdapterFromClient(mockCallClient, mockCallAgent, locator);
    expect(adapter).toBeDefined();
    expect(adapter.getState().sounds).toBeUndefined();
  });
  /* @conditional-compile-remove(calling-sounds) */
  test('when creating an adapter with sounds provided we should see it in state', async () => {
    const mockCallClient = new MockCallClient() as unknown as StatefulCallClient;

    const mockCallAgent = new MockCallAgent();
    const locator = { participantIds: ['some user id'] };
    const options: CommonCallAdapterOptions = {
      soundOptions: {
        callingSounds: {
          callEnded: { path: 'test/path/ended' },
          callRinging: { path: 'test/path/ringing' },
          callBusy: { path: 'test/path/busy' }
        }
      }
    };

    const adapter = await createAzureCommunicationCallAdapterFromClient(
      mockCallClient,
      mockCallAgent,
      locator,
      options
    );
    expect(adapter).toBeDefined();
    expect(adapter.getState().sounds).toBeDefined();
    expect(adapter.getState().sounds?.callEnded).toBeDefined();
    expect(adapter.getState().sounds?.callEnded).toEqual({ path: 'test/path/ended' });
    expect(adapter.getState().sounds?.callRinging).toBeDefined();
    expect(adapter.getState().sounds?.callRinging).toEqual({ path: 'test/path/ringing' });
    expect(adapter.getState().sounds?.callBusy).toBeDefined();
    expect(adapter.getState().sounds?.callBusy).toEqual({ path: 'test/path/busy' });
  });
  /* @conditional-compile-remove(calling-sounds) */
  test('when creating an adapter with one sound we should see it and not the other', async () => {
    const mockCallClient = new MockCallClient() as unknown as StatefulCallClient;

    const mockCallAgent = new MockCallAgent();
    const locator = { participantIds: ['some user id'] };
    const options: CommonCallAdapterOptions = {
      soundOptions: {
        callingSounds: {
          callEnded: { path: 'test/path/ended' }
        }
      }
    };

    const adapter = await createAzureCommunicationCallAdapterFromClient(
      mockCallClient,
      mockCallAgent,
      locator,
      options
    );
    expect(adapter).toBeDefined();
    expect(adapter.getState().sounds).toBeDefined();
    expect(adapter.getState().sounds?.callEnded).toBeDefined();
    expect(adapter.getState().sounds?.callEnded).toEqual({ path: 'test/path/ended' });
    expect(adapter.getState().sounds?.callRinging).toBeUndefined();
    expect(adapter.getState().sounds?.callBusy).toBeUndefined();
  });
});
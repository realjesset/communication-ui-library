// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { EventEmitter } from 'events';
import {
  AudioDeviceInfo,
  Call,
  DtmfTone,
  ParticipantRole,
  PermissionConstraints,
  VideoDeviceInfo,
  /* @conditional-compile-remove(PSTN-calls) */
  EnvironmentInfo,
  /* @conditional-compile-remove(teams-identity-support) */
  CallKind
} from '@azure/communication-calling';
import { CallAdapter, CallAdapterState } from '@azure/communication-react';

/**
 * Temporary copy of the packages/react-composites/tests/browser/call/app/mocks/MockCallAdapter.ts
 * @internal
 */
// TODO: Remove this simplified copy of the MockCallAdapter when the original MockCallAdapter is moved to fake-backends package and can be imported
export class _MockCallAdapter implements CallAdapter {
  constructor(testState: {
    askDevicePermission?: (constrain: PermissionConstraints) => Promise<void>;
    localParticipantRole?: ParticipantRole;
  }) {
    this.state = {
      ...createDefaultCallAdapterState(/* @conditional-compile-remove(rooms) */ testState.localParticipantRole)
    };

    if (testState.askDevicePermission) {
      this.askDevicePermission = testState.askDevicePermission;
    }
  }

  state: CallAdapterState;

  private emitter = new EventEmitter();

  setState(state: CallAdapterState): void {
    this.state = state;
    this.emitter.emit('stateChanged', state);
  }

  addParticipant(): Promise<void> {
    throw Error('addParticipant not implemented');
  }
  onStateChange(handler: (state: CallAdapterState) => void): void {
    this.emitter.addListener('stateChanged', handler);
  }
  offStateChange(handler: (state: CallAdapterState) => void): void {
    this.emitter.removeListener('stateChanged', handler);
  }
  allowUnsupportedBrowserVersion(): void {
    throw Error('allowWithUnsupportedBrowserVersion not implemented');
  }
  getState(): CallAdapterState {
    return this.state;
  }
  dispose(): void {
    throw Error('dispose not implemented');
  }
  joinCall(): Call | undefined {
    throw Error('joinCall not implemented');
  }
  leaveCall(): Promise<void> {
    throw Error('leaveCall not implemented');
  }
  startCamera(): Promise<void> {
    throw Error('leaveCall not implemented');
  }
  stopCamera(): Promise<void> {
    throw Error('stopCamera not implemented');
  }
  mute(): Promise<void> {
    throw Error('mute not implemented');
  }
  unmute(): Promise<void> {
    throw Error('unmute not implemented');
  }
  startCall(): Call | undefined {
    throw Error('startCall not implemented');
  }
  holdCall(): Promise<void> {
    return Promise.resolve();
  }
  resumeCall(): Promise<void> {
    return Promise.resolve();
  }
  startScreenShare(): Promise<void> {
    throw Error('startScreenShare not implemented');
  }
  stopScreenShare(): Promise<void> {
    throw Error('stopScreenShare not implemented');
  }
  /* @conditional-compile-remove(raise-hand) */
  raiseHand(): Promise<void> {
    throw Error('raiseHand not implemented');
  }
  /* @conditional-compile-remove(raise-hand) */
  lowerHand(): Promise<void> {
    throw Error('lowerHand not implemented');
  }
  removeParticipant(): Promise<void> {
    throw Error('removeParticipant not implemented');
  }
  createStreamView(): Promise<void> {
    throw Error('createStreamView not implemented');
  }
  disposeStreamView(): Promise<void> {
    return Promise.resolve();
  }
  disposeScreenShareStreamView(): Promise<void> {
    return Promise.resolve();
  }
  disposeLocalVideoStreamView(): Promise<void> {
    return Promise.resolve();
  }
  disposeRemoteVideoStreamView(): Promise<void> {
    return Promise.resolve();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  askDevicePermission(constrain: PermissionConstraints): Promise<void> {
    throw Error('askDevicePermission not implemented');
  }
  async queryCameras(): Promise<VideoDeviceInfo[]> {
    return [];
  }
  async queryMicrophones(): Promise<AudioDeviceInfo[]> {
    return [];
  }
  async querySpeakers(): Promise<AudioDeviceInfo[]> {
    return [];
  }
  setCamera(): Promise<void> {
    throw Error('setCamera not implemented');
  }
  setMicrophone(): Promise<void> {
    throw Error('setMicrophone not implemented');
  }
  setSpeaker(): Promise<void> {
    throw Error('setSpeaker not implemented');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sendDtmfTone(dtmfTone: DtmfTone): Promise<void> {
    throw Error('sendDtmfTone not implemented');
  }
  on(): void {
    throw Error('on not implemented');
  }
  off(): void {
    throw Error('off not implemented');
  }
  /* @conditional-compile-remove(PSTN-calls) */
  getEnvironmentInfo(): Promise<EnvironmentInfo> {
    throw Error('getEnvironmentInfo not implemented');
  }

  /* @conditional-compile-remove(close-captions) */
  startCaptions(): Promise<void> {
    throw Error('start captions not implemented');
  }

  /* @conditional-compile-remove(close-captions) */
  setCaptionLanguage(): Promise<void> {
    throw Error('setCaptionLanguage not implemented');
  }

  /* @conditional-compile-remove(close-captions) */
  setSpokenLanguage(): Promise<void> {
    throw Error('setSpokenLanguage not implemented');
  }

  /* @conditional-compile-remove(close-captions) */
  stopCaptions(): Promise<void> {
    throw Error('stopCaptions not implemented');
  }
  /* @conditional-compile-remove(video-background-effects) */
  startVideoBackgroundEffect(): Promise<void> {
    throw new Error('startVideoBackgroundEffect not implemented.');
  }

  /* @conditional-compile-remove(video-background-effects) */
  stopVideoBackgroundEffects(): Promise<void> {
    throw new Error('stopVideoBackgroundEffects not implemented.');
  }
  /* @conditional-compile-remove(video-background-effects) */
  updateBackgroundPickerImages(): void {
    throw new Error('updateBackgroundPickerImages not implemented.');
  }
  /* @conditional-compile-remove(video-background-effects) */
  public updateSelectedVideoBackgroundEffect(): void {
    throw new Error('updateSelectedVideoBackgroundEffect not implemented.');
  }
}

/**
 * Default call adapter state that the {@link _MockCallAdapter} class is initialized with an optional role.
 */
const createDefaultCallAdapterState = (role?: ParticipantRole): CallAdapterState => {
  return {
    displayName: 'Agnes Thompson',
    isLocalPreviewMicrophoneEnabled: true,
    page: 'call',
    call: {
      id: 'call1',
      /* @conditional-compile-remove(teams-identity-support) */
      kind: CallKind.Call,
      callerInfo: { displayName: 'caller', identifier: { kind: 'communicationUser', communicationUserId: '1' } },
      direction: 'Incoming',
      transcription: { isTranscriptionActive: false },
      recording: { isRecordingActive: false },
      startTime: new Date(500000000000),
      endTime: new Date(500000000000),
      diagnostics: { network: { latest: {} }, media: { latest: {} } },
      state: 'Connected',
      localVideoStreams: [],
      isMuted: false,
      isScreenSharingOn: false,
      remoteParticipants: {},
      remoteParticipantsEnded: {},
      /* @conditional-compile-remove(raise-hand) */
      raiseHand: { raisedHands: [] },
      /* @conditional-compile-remove(rooms) */
      role,
      /* @conditional-compile-remove(close-captions) */
      captionsFeature: {
        captions: [],
        supportedSpokenLanguages: [],
        supportedCaptionLanguages: [],
        currentCaptionLanguage: '',
        currentSpokenLanguage: '',
        isCaptionsFeatureActive: false,
        startCaptionsInProgress: false
      },
      /* @conditional-compile-remove(call-transfer) */
      transfer: {
        acceptedTransfers: {}
      },
      /* @conditional-compile-remove(optimal-video-count) */
      optimalVideoCount: {
        maxRemoteVideoStreams: 4
      }
    },
    userId: { kind: 'communicationUser', communicationUserId: '1' },
    devices: {
      isSpeakerSelectionAvailable: true,
      selectedCamera: { id: 'camera1', name: '1st Camera', deviceType: 'UsbCamera' },
      cameras: [{ id: 'camera1', name: '1st Camera', deviceType: 'UsbCamera' }],
      selectedMicrophone: {
        id: 'microphone1',
        name: '1st Microphone',
        deviceType: 'Microphone',
        isSystemDefault: true
      },
      microphones: [{ id: 'microphone1', name: '1st Microphone', deviceType: 'Microphone', isSystemDefault: true }],
      selectedSpeaker: { id: 'speaker1', name: '1st Speaker', deviceType: 'Speaker', isSystemDefault: true },
      speakers: [{ id: 'speaker1', name: '1st Speaker', deviceType: 'Speaker', isSystemDefault: true }],
      unparentedViews: [],
      deviceAccess: { video: true, audio: true }
    },
    isTeamsCall: false,
    /* @conditional-compile-remove(rooms) */
    isRoomsCall: false,
    latestErrors: {}
  };
};
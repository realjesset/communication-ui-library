// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(ppt-live) */
import { PPTLiveCallFeature } from '@azure/communication-calling';

/* @conditional-compile-remove(ppt-live) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(ppt-live) */
import { CallIdRef } from './CallIdRef';

/* @conditional-compile-remove(ppt-live) */
/**
 * @private
 */
export class PPTLiveSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _pptLive: PPTLiveCallFeature;

  constructor(callIdRef: CallIdRef, context: CallContext, pptLive: PPTLiveCallFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._pptLive = pptLive;

    this.subscribe();
  }

  private subscribe = (): void => {
    this._pptLive.on('isActiveChanged', this.isAvailableChanged);
  };

  public unsubscribe = (): void => {
    this._pptLive.off('isActiveChanged', this.isAvailableChanged);
  };

  private isAvailableChanged = (): void => {
    this._context.setCallPPTLiveActive(this._callIdRef.callId, this._pptLive.isActive);
    this.checkAndUpdatePPTLiveParticipant();
  };

  private checkAndUpdatePPTLiveParticipant = async (): Promise<void> => {
    if (this._pptLive.isActive) {
      this._context.setCallParticipantPPTLive(this._callIdRef.callId, this._pptLive.target);
    } else {
      this._context.setCallParticipantPPTLive(this._callIdRef.callId, undefined);
    }
  };
}

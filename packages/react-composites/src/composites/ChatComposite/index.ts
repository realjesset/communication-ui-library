// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export {
  createAzureCommunicationChatAdapter,
  createAzureCommunicationChatAdapterFromClient,
  useAzureCommunicationChatAdapter
} from './adapter/AzureCommunicationChatAdapter';
export type { AzureCommunicationChatAdapterArgs } from './adapter/AzureCommunicationChatAdapter';
export { ChatComposite } from './ChatComposite';
export type { ChatCompositeProps, ChatCompositeOptions } from './ChatComposite';
/* @conditional-compile-remove(rich-text-editor) */
export type { RichTextEditorOptions } from './ChatComposite';

export type {
  ChatAdapter,
  ChatAdapterSubscribers,
  ChatAdapterThreadManagement,
  ChatCompositeClientState,
  ChatAdapterState,
  ChatAdapterUiState,
  MessageReadListener,
  MessageReceivedListener,
  MessageSentListener,
  MessageEditedListener,
  MessageDeletedListener,
  ParticipantsAddedListener,
  ParticipantsRemovedListener,
  TopicChangedListener
} from './adapter/ChatAdapter';

export type { ResourceDetails } from './adapter/ChatAdapter';

export * from './Strings';

/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
export type {
  AttachmentOptions,
  AttachmentMetadata,
  AttachmentUploadStatus,
  AttachmentUploadOptions,
  AttachmentDownloadOptions,
  AttachmentUploadHandler,
  AttachmentUploadManager
} from './file-sharing';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
export type {
  AttachmentUploadsUiState,
  AttachmentUploadAdapter
} from './adapter/AzureCommunicationAttachmentUploadAdapter';

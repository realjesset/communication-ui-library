// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _formatString } from '@internal/acs-ui-common';
import React, { useCallback, useState } from 'react';
import { ChatMessageComponentAsEditBox } from '../ChatMessageComponentAsEditBox';
import { MessageThreadStrings } from '../../MessageThread';
import { ChatMessage, ComponentSlotStyle, OnRenderAvatarCallback } from '../../../types';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../../../types';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { AttachmentMenuAction, AttachmentMetadata } from '../../../types/Attachment';
/* @conditional-compile-remove(mention) */
import { MentionOptions } from '../../MentionPopover';
import { InlineImageOptions } from '../ChatMessageContent';
import { ChatMyMessageComponentAsMessageBubble } from './ChatMyMessageComponentAsMessageBubble';

type ChatMyMessageComponentProps = {
  message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage;
  userId: string;
  messageContainerStyle?: ComponentSlotStyle;
  showDate?: boolean;
  disableEditing?: boolean;
  onUpdateMessage?: (
    messageId: string,
    content: string,
    metadata?: Record<string, string>,
    options?: {
      /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
      attachmentMetadata?: AttachmentMetadata[];
    }
  ) => Promise<void>;
  onCancelEditMessage?: (messageId: string) => void;
  /**
   * Callback to delete a message. Also called before resending a message that failed to send.
   * @param messageId ID of the message to delete
   */
  onDeleteMessage?: (messageId: string) => Promise<void>;
  /**
   * Callback to send a message
   * @param content The message content to send
   */
  onSendMessage?: (content: string) => Promise<void>;
  strings: MessageThreadStrings;
  messageStatus?: string;
  /**
   * Optional text to display when the message status is 'failed'.
   */
  failureReason?: string;
  /**
   * Whether the status indicator for each message is displayed or not.
   */
  showMessageStatus?: boolean;
  /**
   * Whether to overlap avatar and message when the view is width constrained.
   */
  shouldOverlapAvatarAndMessage: boolean;
  remoteParticipantsCount?: number;
  onActionButtonClick: (
    message: ChatMessage,
    setMessageReadBy: (readBy: { id: string; displayName: string }[]) => void
  ) => void;
  /**
   * Optional callback to override render of the avatar.
   *
   * @param userId - user Id
   */
  onRenderAvatar?: OnRenderAvatarCallback;
  /* @conditional-compile-remove(date-time-customization) */
  /**
   * Optional function to provide customized date format.
   * @beta
   */
  onDisplayDateTimeString?: (messageDate: Date) => string;
  /* @conditional-compile-remove(mention) */
  /**
   * Optional props needed to lookup suggestions and display mentions in the mention scenario.
   * @beta
   */
  mentionOptions?: MentionOptions;
  /**
   * Optional callback called when an inline image is clicked.
   * @beta
   */
  inlineImageOptions?: InlineImageOptions;
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  /**
   * Optional callback to render message attachments in the message component.
   */
  onRenderAttachmentDownloads?: (userId: string, message: ChatMessage) => JSX.Element;
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  /**
   * Optional callback to define custom actions for attachments.
   */
  actionsForAttachment?: (attachment: AttachmentMetadata, message?: ChatMessage) => AttachmentMenuAction[];
};

/**
 * @private
 */
export const ChatMyMessageComponent = (props: ChatMyMessageComponentProps): JSX.Element => {
  const { onDeleteMessage, onSendMessage, message } = props;
  const [isEditing, setIsEditing] = useState(false);

  const onEditClick = useCallback(() => setIsEditing(true), [setIsEditing]);

  const clientMessageId = 'clientMessageId' in message ? message.clientMessageId : undefined;
  const content = 'content' in message ? message.content : undefined;
  const onRemoveClick = useCallback(() => {
    if (onDeleteMessage && message.messageId) {
      onDeleteMessage(message.messageId);
    }
    // when fail to send, message does not have message id, delete message using clientMessageId
    else if (onDeleteMessage && message.messageType === 'chat' && clientMessageId) {
      onDeleteMessage(clientMessageId);
    }
  }, [onDeleteMessage, message.messageId, message.messageType, clientMessageId]);
  const onResendClick = useCallback(() => {
    onDeleteMessage && clientMessageId && onDeleteMessage(clientMessageId);
    onSendMessage && onSendMessage(content !== undefined ? content : '');
  }, [clientMessageId, content, onSendMessage, onDeleteMessage]);

  if (isEditing && message.messageType === 'chat') {
    return (
      <ChatMessageComponentAsEditBox
        message={message}
        strings={props.strings}
        onSubmit={async (text, metadata, options) => {
          props.onUpdateMessage &&
            message.messageId &&
            (await props.onUpdateMessage(message.messageId, text, metadata, options));
          setIsEditing(false);
        }}
        onCancel={(messageId) => {
          props.onCancelEditMessage && props.onCancelEditMessage(messageId);
          setIsEditing(false);
        }}
        /* @conditional-compile-remove(mention) */
        mentionLookupOptions={props.mentionOptions?.lookupOptions}
      />
    );
  } else {
    return (
      <ChatMyMessageComponentAsMessageBubble
        {...props}
        onRemoveClick={onRemoveClick}
        onEditClick={onEditClick}
        onResendClick={onResendClick}
        onRenderAvatar={props.onRenderAvatar}
        /* @conditional-compile-remove(date-time-customization) */
        onDisplayDateTimeString={props.onDisplayDateTimeString}
        strings={props.strings}
        inlineImageOptions={props.inlineImageOptions}
        /* @conditional-compile-remove(mention) */
        mentionDisplayOptions={props.mentionOptions?.displayOptions}
      />
    );
  }
};

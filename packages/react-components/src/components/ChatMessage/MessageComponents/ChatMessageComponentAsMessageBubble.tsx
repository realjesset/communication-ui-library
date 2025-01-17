// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Text, mergeStyles } from '@fluentui/react';
import { ChatMessage as FluentChatMessage } from '@fluentui-contrib/react-chat';
import { _formatString } from '@internal/acs-ui-common';
import React, { useCallback, useMemo } from 'react';
import { chatMessageDateStyle, chatMessageAuthorStyle } from '../../styles/ChatMessageComponent.styles';
import { useIdentifiers } from '../../../identifiers/IdentifierProvider';
import { useTheme } from '../../../theming';
import { InlineImageOptions } from '../ChatMessageContent';
import { ChatMessage } from '../../../types/ChatMessage';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../../../types/ChatMessage';
import { MessageThreadStrings } from '../../MessageThread';
import { ComponentSlotStyle } from '../../../types';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { AttachmentMenuAction, AttachmentMetadata } from '../../../types';
import { _AttachmentDownloadCards } from '../../AttachmentDownloadCards';
import { useLocale } from '../../../localization';
/* @conditional-compile-remove(mention) */
import { MentionDisplayOptions } from '../../MentionPopover';
import { createStyleFromV8Style } from '../../styles/v8StyleShim';
import { mergeClasses } from '@fluentui/react-components';
import { useChatMessageStyles, useChatMessageCommonStyles } from '../../styles/MessageThread.styles';
import {
  generateCustomizedTimestamp,
  generateDefaultTimestamp,
  getMessageBubbleContent,
  getMessageEditedDetails
} from '../../utils/ChatMessageComponentUtils';

type ChatMessageComponentAsMessageBubbleProps = {
  message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage;
  messageContainerStyle?: ComponentSlotStyle;
  showDate?: boolean;
  strings: MessageThreadStrings;
  userId: string;
  /**
   * Whether to overlap avatar and message when the view is width constrained.
   */
  shouldOverlapAvatarAndMessage: boolean;
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
  /**
   * Optional function to provide customized date format.
   * @beta
   */
  onDisplayDateTimeString?: (messageDate: Date) => string;
  /* @conditional-compile-remove(mention) */
  /**
   * Optional props needed to display suggestions in the mention scenario.
   * @internal
   */
  mentionDisplayOptions?: MentionDisplayOptions;
  /**
   * Optional callback called when an inline image is clicked.
   * @beta
   */
  inlineImageOptions?: InlineImageOptions;
};

/** @private */
const MessageBubble = (props: ChatMessageComponentAsMessageBubbleProps): JSX.Element => {
  const ids = useIdentifiers();
  const theme = useTheme();
  const locale = useLocale();

  const {
    userId,
    message,
    showDate,
    messageContainerStyle,
    strings,
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
    onRenderAttachmentDownloads,
    inlineImageOptions,
    shouldOverlapAvatarAndMessage,
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
    actionsForAttachment,
    /* @conditional-compile-remove(mention) */
    mentionDisplayOptions,
    onDisplayDateTimeString
  } = props;

  const formattedTimestamp = useMemo(() => {
    const defaultTimeStamp = message.createdOn
      ? generateDefaultTimestamp(message.createdOn, showDate, strings)
      : undefined;

    const customTimestamp = message.createdOn
      ? generateCustomizedTimestamp(message.createdOn, locale, onDisplayDateTimeString)
      : '';

    return customTimestamp || defaultTimeStamp;
  }, [locale, message.createdOn, onDisplayDateTimeString, showDate, strings]);

  const getMessageDetails = useCallback(() => {
    return getMessageEditedDetails(message, theme, strings.editedTag);
  }, [strings.editedTag, theme, message]);

  const getContent = useCallback(() => {
    return getMessageBubbleContent(
      message,
      strings,
      userId,
      inlineImageOptions,
      /* @conditional-compile-remove(mention) */
      mentionDisplayOptions,
      /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
      onRenderAttachmentDownloads,
      /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
      actionsForAttachment
    );
  }, [
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */ actionsForAttachment,
    inlineImageOptions,
    /* @conditional-compile-remove(mention) */ mentionDisplayOptions,
    message,
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */ onRenderAttachmentDownloads,
    strings,
    userId
  ]);

  const isBlockedMessage =
    false || /* @conditional-compile-remove(data-loss-prevention) */ message.messageType === 'blocked';
  const chatMessageCommonStyles = useChatMessageCommonStyles();

  const chatMessageStyles = useChatMessageStyles();
  const chatItemMessageContainerClassName = mergeClasses(
    // messageContainerStyle used in className and style prop as style prop can't handle CSS selectors
    chatMessageStyles.body,
    // disable placeholder functionality for GA releases as it might confuse users
    chatMessageStyles.bodyWithPlaceholderImage,
    isBlockedMessage
      ? chatMessageCommonStyles.blocked
      : props.message.status === 'failed'
      ? chatMessageCommonStyles.failed
      : undefined,
    shouldOverlapAvatarAndMessage ? chatMessageStyles.avatarOverlap : chatMessageStyles.avatarNoOverlap,
    message.attached === 'top' || message.attached === false
      ? chatMessageStyles.bodyWithAvatar
      : chatMessageStyles.bodyWithoutAvatar,
    mergeStyles(messageContainerStyle)
  );

  const attached = message.attached === true ? 'center' : message.attached === 'bottom' ? 'bottom' : 'top';
  const chatMessage = (
    <>
      <div key={props.message.messageId}>
        <FluentChatMessage
          attached={attached}
          key={props.message.messageId}
          root={{
            className: chatMessageStyles.root,
            // make body not focusable to remove repetitions from narrators.
            // inner components are already focusable
            tabIndex: -1,
            role: 'none'
          }}
          author={<Text className={chatMessageAuthorStyle}>{message.senderDisplayName}</Text>}
          body={{
            className: chatItemMessageContainerClassName,
            style: { ...createStyleFromV8Style(messageContainerStyle) }
          }}
          data-ui-id="chat-composite-message"
          timestamp={
            <Text className={chatMessageDateStyle} data-ui-id={ids.messageTimestamp}>
              {formattedTimestamp}
            </Text>
          }
          details={getMessageDetails()}
        >
          {getContent()}
        </FluentChatMessage>
      </div>
    </>
  );
  return chatMessage;
};

/** @private */
export const ChatMessageComponentAsMessageBubble = React.memo(MessageBubble);

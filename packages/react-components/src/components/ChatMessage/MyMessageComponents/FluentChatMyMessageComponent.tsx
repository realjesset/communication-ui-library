// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageStatus, _formatString } from '@internal/acs-ui-common';
import React, { useCallback, useMemo } from 'react';
import { MessageProps, _ChatMessageProps } from '../../MessageThread';
import { ChatMessage } from '../../../types';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../../../types';
import { noMessageStatusStyle, useChatMessageRenderStyles } from '../../styles/MessageThread.styles';
import { mergeStyles } from '@fluentui/react';
import { mergeClasses } from '@fluentui/react-components';
import { createStyleFromV8Style } from '../../styles/v8StyleShim';
import { MessageStatusIndicatorProps } from '../../MessageStatusIndicator';
import { ChatMyMessageComponent } from './ChatMyMessageComponent';
import { ChatMyMessage as FluentChatMyMessage } from '@fluentui-contrib/react-chat';
import { getFluentUIAttachedValue } from '../../utils/ChatMessageComponentUtils';
import type { FluentChatMessageComponentWrapperProps } from '../MessageComponents/FluentChatMessageComponent';

/**
 * The component for rendering a chat message using Fluent UI components
 * and handling default and custom renderers.
 * This component handles rendering for chat message body, avatar and message status.
 * The chat message body, avatar and message status should be shown for both default and custom renderers.
 *
 * @private
 */
export const FluentChatMyMessageComponent = (props: FluentChatMessageComponentWrapperProps): JSX.Element => {
  const {
    message,
    styles,
    shouldOverlapAvatarAndMessage,
    onRenderMessage,
    onRenderAvatar,
    showMessageStatus,
    onRenderMessageStatus,
    participantCount,
    readCount,
    onActionButtonClick,
    /* @conditional-compile-remove(date-time-customization) */
    onDisplayDateTimeString,
    inlineImageOptions,
    /* @conditional-compile-remove(mention) */
    mentionOptions,
    userId,
    defaultStatusRenderer,
    statusToRender,
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
    actionsForAttachment,
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
    onRenderAttachmentDownloads
  } = props;
  const chatMessageRenderStyles = useChatMessageRenderStyles();
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  const onRenderAttachmentDownloadsMemo = useMemo(() => {
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
    return onRenderAttachmentDownloads;
    return undefined;
  }, [
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */ onRenderAttachmentDownloads
  ]);

  // To rerender the defaultChatMessageRenderer if app running across days(every new day chat time stamp
  // needs to be regenerated), the dependency on "new Date().toDateString()"" is added.
  const defaultChatMessageRenderer = useCallback(
    (messageProps: MessageProps) => {
      if (
        messageProps.message.messageType === 'chat' ||
        /* @conditional-compile-remove(data-loss-prevention) */ messageProps.message.messageType === 'blocked'
      ) {
        return (
          <ChatMyMessageComponent
            {...messageProps}
            /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
            onRenderAttachmentDownloads={onRenderAttachmentDownloadsMemo}
            /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
            strings={messageProps.strings}
            message={messageProps.message}
            userId={userId}
            remoteParticipantsCount={participantCount ? participantCount - 1 : 0}
            shouldOverlapAvatarAndMessage={shouldOverlapAvatarAndMessage}
            onRenderAvatar={onRenderAvatar}
            showMessageStatus={showMessageStatus}
            messageStatus={messageProps.message.status}
            onActionButtonClick={onActionButtonClick}
            /* @conditional-compile-remove(date-time-customization) */
            onDisplayDateTimeString={onDisplayDateTimeString}
            inlineImageOptions={inlineImageOptions}
            /* @conditional-compile-remove(mention) */
            mentionOptions={mentionOptions}
            /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
            actionsForAttachment={actionsForAttachment}
          />
        );
      }
      return <></>;
    },
    [
      onActionButtonClick,
      onRenderAvatar,
      participantCount,
      shouldOverlapAvatarAndMessage,
      showMessageStatus,
      userId,
      /* @conditional-compile-remove(date-time-customization) */
      onDisplayDateTimeString,
      inlineImageOptions,
      /* @conditional-compile-remove(mention) */
      mentionOptions,
      /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
      onRenderAttachmentDownloadsMemo,
      /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
      actionsForAttachment,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      new Date().toDateString()
    ]
  );

  const messageRenderer = useCallback(
    (messageProps: MessageProps) => {
      return onRenderMessage === undefined
        ? defaultChatMessageRenderer({ ...messageProps })
        : onRenderMessage(messageProps, defaultChatMessageRenderer);
    },
    [defaultChatMessageRenderer, onRenderMessage]
  );

  const messageStatusRenderer = useCallback(
    (
      onRenderMessageStatus:
        | ((messageStatusIndicatorProps: MessageStatusIndicatorProps) => JSX.Element | null)
        | undefined,
      defaultStatusRenderer: (
        message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage,
        participantCount: number,
        readCount: number,
        status?: MessageStatus
      ) => JSX.Element,
      showMessageStatus?: boolean,
      participantCount?: number,
      readCount?: number
    ) => {
      return showMessageStatus && statusToRender ? (
        onRenderMessageStatus ? (
          onRenderMessageStatus({ status: message.status })
        ) : (
          defaultStatusRenderer(message, participantCount ?? 0, readCount ?? 0, message.status)
        )
      ) : (
        <div className={mergeStyles(noMessageStatusStyle)} />
      );
    },
    [message, statusToRender]
  );

  const attached = useMemo(() => {
    return getFluentUIAttachedValue(message.attached);
  }, [message.attached]);

  const myMessageRootProps = useMemo(() => {
    return {
      // myChatItemMessageContainer used in className and style prop as style prop can't handle CSS selectors
      className: mergeClasses(
        chatMessageRenderStyles.rootMyMessage,
        chatMessageRenderStyles.rootCommon,
        mergeStyles(styles?.myChatItemMessageContainer)
      ),
      style:
        styles?.myChatItemMessageContainer !== undefined
          ? createStyleFromV8Style(styles?.myChatItemMessageContainer)
          : {},
      role: 'none'
    };
  }, [chatMessageRenderStyles.rootCommon, chatMessageRenderStyles.rootMyMessage, styles?.myChatItemMessageContainer]);

  const myMessageBodyProps = useMemo(() => {
    return {
      className: mergeClasses(chatMessageRenderStyles.bodyCommon, chatMessageRenderStyles.bodyMyMessage),
      // make body not focusable to remove repetitions from narrators.
      // inner components are already focusable
      tabIndex: -1,
      role: 'none'
    };
  }, [chatMessageRenderStyles.bodyCommon, chatMessageRenderStyles.bodyMyMessage]);

  const myMessageStatusIcon = useMemo(() => {
    return (
      <div
        className={mergeStyles(
          { paddingLeft: '0.25rem' },
          styles?.messageStatusContainer ? styles.messageStatusContainer(message.mine ?? false) : ''
        )}
      >
        {message.status
          ? messageStatusRenderer(
              onRenderMessageStatus,
              defaultStatusRenderer,
              showMessageStatus,
              participantCount,
              readCount
            )
          : undefined}
      </div>
    );
  }, [
    defaultStatusRenderer,
    message.mine,
    message.status,
    messageStatusRenderer,
    onRenderMessageStatus,
    participantCount,
    readCount,
    showMessageStatus,
    styles
  ]);

  // Fluent UI message components are used here as for default message renderer,
  // timestamp and author name should be shown but they aren't shown for custom renderer.
  // More investigations are needed to check if this can be simplified with states.
  // Status and avatar should be shown for both custom and default renderers.
  return (
    <FluentChatMyMessage
      attached={attached}
      root={myMessageRootProps}
      body={myMessageBodyProps}
      statusIcon={myMessageStatusIcon}
    >
      {messageRenderer({ ...props })}
    </FluentChatMyMessage>
  );
};

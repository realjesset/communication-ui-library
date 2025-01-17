// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(reaction) */
import React, { useCallback, useEffect, useState } from 'react';
/* @conditional-compile-remove(reaction) */
import { Reaction, ReactionResources } from '../../types';
/* @conditional-compile-remove(reaction) */
import { getEmojiFrameCount, getEmojiResource } from './utils/videoGalleryLayoutUtils';
/* @conditional-compile-remove(reaction) */
import { Stack, mergeStyles } from '@fluentui/react';
/* @conditional-compile-remove(reaction) */
import { reactionRenderingStyle, videoContainerStyles } from '../styles/VideoTile.styles';
/* @conditional-compile-remove(reaction) */
import {
  REACTION_SCREEN_SHARE_ANIMATION_TIME_MS,
  REACTION_START_DISPLAY_SIZE,
  getReceivedUnixTime
} from './utils/reactionUtils';

/* @conditional-compile-remove(reaction) */
/**
 * Reaction overlay component for Grid
 *
 * Can be used with {@link MeetingReactionOverlay}.
 *
 * @internal
 */
export const ParticipantVideoTileOverlay = React.memo(
  (props: { reaction?: Reaction; reactionResources: ReactionResources; emojiSize?: number }) => {
    const { reaction, reactionResources, emojiSize = REACTION_START_DISPLAY_SIZE } = props;
    const [isValidImageSource, setIsValidImageSource] = useState<boolean>(false);

    const backgroundImageUrl =
      reaction !== undefined && reactionResources !== undefined
        ? getEmojiResource(reaction?.reactionType, reactionResources)
        : undefined;

    const frameCount =
      reaction !== undefined && reactionResources !== undefined
        ? getEmojiFrameCount(reaction?.reactionType, reactionResources)
        : undefined;

    const currentUnixTimeStamp = Date.now();
    const receivedUnixTimestamp = reaction ? getReceivedUnixTime(reaction.receivedOn) : undefined;
    const canRenderReaction =
      (receivedUnixTimestamp
        ? currentUnixTimeStamp - receivedUnixTimestamp < REACTION_SCREEN_SHARE_ANIMATION_TIME_MS
        : false) && backgroundImageUrl !== undefined;

    useEffect(() => {
      if (!backgroundImageUrl || backgroundImageUrl.length === 0) {
        return;
      }

      fetch(`${backgroundImageUrl}`)
        .then((res) => {
          setIsValidImageSource(res.ok);
        })
        .catch((warning) => console.warn(`Sprite image for animation rendering failed with warning: ${warning}`));

      return () => setIsValidImageSource(false);
    }, [backgroundImageUrl]);

    const spriteImageUrl = backgroundImageUrl ?? undefined;
    const reactionContainerStyles = useCallback(
      () =>
        reactionRenderingStyle({
          spriteImageUrl,
          emojiSize: emojiSize,
          frameCount
        }),
      [spriteImageUrl, emojiSize, frameCount]
    );

    return (
      <Stack
        className={mergeStyles(videoContainerStyles, {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: canRenderReaction ? 'rgba(0, 0, 0, 0.5)' : 'transparent'
        })}
      >
        <div style={{ height: '33.33%' }}></div>
        {canRenderReaction && isValidImageSource && (
          <div style={{ minHeight: '84px', height: '84px', width: '84px' }}>
            <div className={reactionContainerStyles()} />
          </div>
        )}
      </Stack>
    );
  }
);

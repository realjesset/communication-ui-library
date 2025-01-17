// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { _AttachmentUploadCards, AttachmentUploadCardsProps } from './AttachmentUploadCards';
import { render, screen } from '@testing-library/react';
import { registerIcons } from '@fluentui/react';

describe('AttachmentUploadCards should be rendered properly', () => {
  beforeEach(() => {
    registerIcons({
      icons: {
        cancelattachmentupload: <></>,
        genericfile24_svg: <></>
      }
    });
  });

  it('should render the component', async () => {
    const props = {
      activeAttachmentUploads: [
        {
          id: 'MockId',
          name: 'MockAttachmentUpload',
          progress: 50
        }
      ]
    } as AttachmentUploadCardsProps;
    renderAttachmentUploadCardWithDefaults(props);
    expect(await screen.findByText('MockAttachmentUpload')).toBeDefined();
  });

  it('should not render the component with no activeAttachmentUploads', async () => {
    const props = {
      activeAttachmentUploads: undefined
    } as AttachmentUploadCardsProps;
    renderAttachmentUploadCardWithDefaults(props);
    expect(screen.queryByText('MockAttachmentUpload')).toBeNull();
  });
});

const renderAttachmentUploadCardWithDefaults = (props?: Partial<AttachmentUploadCardsProps>): void => {
  const mergedProps: AttachmentUploadCardsProps = {
    activeAttachmentUploads: props?.activeAttachmentUploads ?? [],
    ...(props ?? {})
  };

  render(<_AttachmentUploadCards {...mergedProps} />);
};

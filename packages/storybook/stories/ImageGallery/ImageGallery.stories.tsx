// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ImageGallery as ImageGalleryComponent } from '@azure/communication-react';
import { ArgsTable, Title, Description, Heading, Source, Canvas } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { DetailedBetaBanner } from '../BetaBanners/DetailedBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../constants';

import { ImageGalleryExample } from './snippets/ImageGallery.snippet';
const ImageGalleryExampleText = require('!!raw-loader!./snippets/ImageGallery.snippet.tsx').default;
const importStatement = `import { ImageGallery } from '@azure/communication-react';`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ImageGallery</Title>
      <DetailedBetaBanner />
      <Description>
        Component to display image in a gallery. The gallery launches as a modal, it takes focus from the page or app
        and require users to interact with them.
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Description>Component will render a fullscreen modal using a set image source.</Description>
      <Canvas mdxSource={ImageGalleryExampleText}>
        <ImageGalleryExample />
      </Canvas>
      <Heading>Props</Heading>
      <ArgsTable of={ImageGalleryComponent} />
    </>
  );
};

const ImageGalleryStory = (): JSX.Element => {
  return <></>;
};

export const ImageGallery = ImageGalleryStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-imagegallery`,
  title: `${COMPONENT_FOLDER_PREFIX}/Image Gallery`,
  component: ImageGalleryComponent,
  parameters: {
    previewTabs: { canvas: { disable: true, hidden: true } },
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
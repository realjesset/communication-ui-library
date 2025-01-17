import { FluentThemeProvider, RichTextSendBox } from '@azure/communication-react';
import React from 'react';

export const RTEAttachmentUploadsExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
      <RichTextSendBox
        activeAttachmentUploads={[
          {
            id: '1',
            name: 'Sample.pdf',
            progress: 0.75
          },
          {
            id: '2',
            name: 'SampleXl.xlsx',
            progress: 0.33
          }
        ]}
        onSendMessage={async () => {
          return;
        }}
      />
    </div>
  </FluentThemeProvider>
);

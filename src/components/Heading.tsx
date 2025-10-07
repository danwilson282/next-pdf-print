// Heading.tsx
import React from 'react';
import { Text } from '@react-pdf/renderer';
import { registerSectionType } from './RenderPdf';
import { extractTextFromReactNode } from './HtmlParser';

type Props = {
  children: React.ReactNode;
  level: string;
  registerSection: registerSectionType;
  id: number;
  style: any;
  subId: string | undefined;
};

const Heading: React.FC<Props> = ({ children, level, registerSection, id, style, subId }) => {
  const textContent = extractTextFromReactNode(children);

  return (
    <Text
      render={({ pageNumber }) => {
        registerSection(textContent, pageNumber, id, `${pageNumber}_${subId}_${level}`);
        return children;
      }}
      style={style}
    />
  );
};

export default Heading;

'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { pdf } from '@react-pdf/renderer';
import FormattedDocument from '../components/FormattedDocument';
import { renderHtmlToPdfNodes } from '../components/HtmlParser';
import { renderMathMLClient } from '@/helpers/mathjaxToSvgClient';
import { FrontCoverProps } from '../components/Cover';

export type sectionType = { title: string; content: React.ReactNode };
export type registerSectionType = (
  title: string,
  pageNumber: number,
  id: number,
  type: string
) => void;

export type tocEntry = { id: number; title: string; pageNumber: number; type: string };
export type tocType = tocEntry[];

export type Section = { title: string; content: string };

type DublinCoreMeta = {
  title?: string;
  author?: string;
  subject?: string;
  description?: string;
  publisher?: string;
  contributor?: string;
  date?: string;
  type?: string;
  format?: string;
  identifier?: string;
  source?: string;
  language?: string;
  relation?: string;
  coverage?: string;
  rights?: string;
};

type PageTemplate = {
  headerText?: string;
  footerText?: string;
  hideHeader?: boolean;
  hideFooter?: boolean;
};

export type DocumentMeta = {
  cover: FrontCoverProps;
  pdfMeta?: DublinCoreMeta;
  pageTemplate?: PageTemplate;
  filename?: string;
  showContentsPage?: boolean;
};

type Props = {
  meta: DocumentMeta;
  sections: Section[];
  setBlob?: (blob: Blob | null) => void;
};

const RenderPdf: React.FC<Props> = ({ meta, sections, setBlob }) => {
  const [processedSections, setProcessedSections] = useState<sectionType[]>([]);
  const [tocMap, setTocMap] = useState<tocType>([]);
  const tempMap = useRef<tocType>([]);
  const [pass, setPass] = useState<1 | 2>(1);
  const [isReady, setIsReady] = useState(false);

  // Collect ToC entries during render
  const registerSection: registerSectionType = useCallback(
    (title, pageNumber, id, type) => {
      if (pass === 1) {
        const existingIndex = tempMap.current.findIndex((entry) => entry.id === id);
        const newEntry = { id, title, pageNumber, type };

        if (existingIndex !== -1) {
          tempMap.current[existingIndex] = newEntry;
        } else {
          tempMap.current.push(newEntry);
        }

        const sorted = [...tempMap.current].sort((a, b) => a.id - b.id);
        setTocMap(sorted);
      }
    },
    [pass]
  );

  // Initial pass: process content sections into renderable nodes
  useEffect(() => {
    const process = async () => {
      const results = await Promise.all(
        sections.map(async (section) => ({
          title: section.title,
          content: await renderHtmlToPdfNodes(
            section.content,
            registerSection,
            true,
            renderMathMLClient
          ),
        }))
      );
      setProcessedSections(results);
    };

    process();
  }, [sections, registerSection]);

  // Detect when pass 1 is done → switch to pass 2
  useEffect(() => {
    if (pass === 1 && tocMap.length > 0 && processedSections.length > 0) {
      setPass(2);
      setIsReady(true);
    }
  }, [tocMap, processedSections, pass]);

  // Final document to render (second pass only)
const memoizedDocument = useMemo(() => {
  return (
    <FormattedDocument
      frontCover={meta.cover}
      sections={processedSections}
      tocMap={pass === 2 ? tocMap : []} // ToC is blank in pass 1
      registerSection={registerSection}
      headerText={meta.pageTemplate?.headerText}
      footerText={meta.pageTemplate?.footerText}
    />
  );
}, [meta, processedSections, tocMap, registerSection, pass]);

  // Generate and open PDF
  const openPDFInNewTab = async () => {
    if (!isReady || !memoizedDocument) {
      alert('Please wait, generating Table of Contents...');
      return;
    }

    const finalBlob = await pdf(memoizedDocument).toBlob();
    const url = URL.createObjectURL(finalBlob);
    window.open(url, '_blank');

    if (setBlob) setBlob(finalBlob);
  };

  return (
    <>    
    {JSON.stringify(tocMap)}
    <button onClick={openPDFInNewTab} disabled={!isReady}>
      {isReady ? 'Open Generated PDF' : 'Preparing document...'}
    </button></>

  );
};

export default RenderPdf;

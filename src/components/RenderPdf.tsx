'use client';

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { BlobProvider } from "@react-pdf/renderer";
import FormattedDocument from "../components/FormattedDocument";
import { renderHtmlToPdfNodes } from "../components/HtmlParser";
import { FrontCoverProps } from "../components/Cover";
import { renderMathMLClient } from "@/helpers/mathjaxToSvgClient";
export type sectionType = { title: string; content: string | React.ReactNode };
export type registerSectionType = (title: string, pageNumber: number, id: number, type: string) => void;
export type tocEntry = { id: number; title: string; pageNumber: number; type: string };
export type tocType = tocEntry[];

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

export type Section = {
  title: string;
  content: string;
};

type Props = {
  meta: DocumentMeta;
  sections: Section[];
  setBlob?: (blob: Blob | null) => void;
};

const RenderPdf: React.FC<Props> = ({ meta, sections, setBlob }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [blob, setLocalBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [tocMap, setTocMap] = useState<tocType>([]);
  const tempMap = useRef<tocType>([]);
  const [ready, setReady] = useState(false);

  const registerSection: registerSectionType = useCallback(
    (title, pageNumber, id, type) => {
      if (!ready) {
        const existingIndex = tempMap.current.findIndex((entry) => entry.id === id);
        const newEntry = { id, title, pageNumber, type };

        if (existingIndex !== -1) {
          tempMap.current[existingIndex] = newEntry;
        } else {
          tempMap.current.push(newEntry);
        }

        const sortedToc = [...tempMap.current].sort((a, b) => a.id - b.id);
        setTocMap(sortedToc);
      }
    },
    [ready]
  );

  const [processedSections, setProcessedSections] = useState<sectionType[]>([]);

  useEffect(() => {
    const processSections = async () => {
      const resolvedSections = await Promise.all(
        sections.map(async (section) => ({
          title: section.title,
          content: await renderHtmlToPdfNodes(section.content, registerSection, true, renderMathMLClient),
        }))
      );
      setProcessedSections(resolvedSections);
    };

    processSections();
  }, [registerSection, sections]);

  const memoizedDocument = useMemo(
    () => (
      <FormattedDocument
        frontCover={meta.cover}
        sections={processedSections}
        tocMap={tocMap}
        registerSection={registerSection}
        headerText={meta.pageTemplate?.headerText}
        footerText={meta.pageTemplate?.footerText}
      />
    ),
    [meta, processedSections, tocMap, registerSection]
  );

  // ✅ React after blob or url changes
  useEffect(() => {
    if (blob && url) {
      setBlob?.(blob);
      setReady(true);
    }
  }, [blob, url, setBlob]);

  return (
    <BlobProvider document={memoizedDocument}>
      {({ blob: b, url: u, loading: l, error: e }) => {
        // ✅ Only update local state if changed
        useEffect(() => {
          setLocalBlob(b || null);
          setUrl(u || null);
          setLoading(l);
          setError(e || null);
        }, [b, u, l, e]);

        if (l) return <span>Generating PDF...</span>;
        if (e) return <span>Error: {e.message}</span>;

        return u ? (
          <a href={u} target="_blank" rel="noopener noreferrer">
            Download PDF
          </a>
        ) : null;
      }}
    </BlobProvider>
  );
};

export default RenderPdf;

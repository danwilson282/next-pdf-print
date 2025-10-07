import React, { useState, useRef, useCallback, useMemo } from "react";
import { BlobProvider } from "@react-pdf/renderer";
import FormattedDocument from "../components/FormattedDocument";
import { renderHtmlToPdfNodes } from "../components/HtmlParser";
import { FrontCoverProps } from "../components/Cover";
export type sectionType = { title: string; content: string | React.ReactNode};
export type registerSectionType = (title: string, pageNumber: number, id: number, type: string) => void;

export type tocEntry = { id: number; title: string; pageNumber: number, type: string };
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
}

type PageTemplate = {
  headerText?: string;
  footerText?: string;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

export type DocumentMeta = {
  cover: FrontCoverProps;
  pdfMeta?: DublinCoreMeta;
  pageTemplate?: PageTemplate;
  filename?: string;
  showContentsPage?: boolean;
}
export type Section = {
    title: string;
    content: string;
}

type Props = {
    meta: DocumentMeta;
    sections: Section[]
    setBlob?: (blob: Blob | null) => void;
}

const RenderPdf: React.FC<Props> = ({meta, sections, setBlob}) => {
  const [tocMap, setTocMap] = useState<tocType>([]);
  const tempMap = useRef<tocType>([]);
  const [ready, setReady] = useState(false);
  const registerSection: registerSectionType = useCallback((title, pageNumber, id, type) => {
    if (!ready){
      const existingIndex = tempMap.current.findIndex(entry => entry.id === id);
  
      const newEntry = { id, title, pageNumber, type };
    
      if (existingIndex !== -1) {
        // ✅ Overwrite existing entry
        tempMap.current[existingIndex] = newEntry;
      } else {
        // ✅ Add new entry
        tempMap.current.push(newEntry);
      }
    
      // Sort updated TOC and update state
      const sortedToc = [...tempMap.current].sort((a, b) => a.id - b.id);
      setTocMap(sortedToc);
    }

  },[ready]);

  const processedSections: sectionType[] = useMemo(()=>(
    sections.map((section, index) => ({
      title: section.title,
      content: typeof section.content === "string" ? renderHtmlToPdfNodes(section.content, registerSection) : section.content
    }))
  ),[registerSection]);

  const memoizedDocument = useMemo(() => (
    <FormattedDocument
      frontCover={meta.cover}
      sections={processedSections}
      tocMap={tocMap}
      registerSection={registerSection}
      headerText={meta.pageTemplate?.headerText}
      footerText={meta.pageTemplate?.footerText}
    />
  ), [meta, sections, tocMap, registerSection]); 
  
  return (
      <BlobProvider document={memoizedDocument}>
        {({ blob, url, loading, error }) => {
          if (loading) return <span>Generating PDF...</span>;
          if (error) return <span>Error: {error.message}</span>;
          if (url) {
            setReady(true)
            if (blob && setBlob){
              setBlob(blob);
            }
            return (
              <a href={url} target="_blank" rel="noopener noreferrer">
                Download PDF
              </a>
            );
          }
          
          return null;
        }}
      </BlobProvider>
  );
};

export default RenderPdf;

import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import FormattedDocument from "@/components/FormattedDocument";
import { renderHtmlToPdfNodes } from "@/components/HtmlParser";
import { DocumentMeta, tocType } from "@/components/RenderPdf";
import { SectionType } from "@/helpers/parseHtmlToSections";
import { SectionInputType } from "@/app/server/page";
import { renderMathMLServer } from "@/helpers/mathjaxToSvgServer";
type BodyType = {
  meta: DocumentMeta;
  sections: SectionInputType[];
};
export async function POST(req: NextRequest) {
  const body: BodyType = await req.json();

  const { meta, sections } = body;

  const tocMap: tocType = [];
  const tempMap: tocType = []



  const registerSection = (title: string, pageNumber: number, id: number, type: string) => {
        const existingIndex = tempMap.findIndex(entry => entry.id === id);
    
        const newEntry = { id, title, pageNumber, type };
      
        if (existingIndex !== -1) {
          // ✅ Overwrite existing entry
          tempMap[existingIndex] = newEntry;
        } else {
          // ✅ Add new entry
          tempMap.push(newEntry);
        }
      
        // Sort updated TOC and update state
        tocMap.push({ id, title, pageNumber, type });
  };

const processedSections = await Promise.all(
  sections.map(async (section: SectionInputType): Promise<SectionType> => (
    {
      title: section.title,
      content: await renderHtmlToPdfNodes(section.content, registerSection, renderMathMLServer)
    }
  ))
);

  const pdfDocPass1 = (
    <FormattedDocument
      frontCover={meta.cover}
      sections={processedSections}
      tocMap={[]}
      registerSection={registerSection}
      headerText={meta.pageTemplate?.headerText}
      footerText={meta.pageTemplate?.footerText}
      useServer
    />
  );
  await renderToBuffer(pdfDocPass1)
  const sortedToc = [...tempMap].sort((a, b) => a.id - b.id);
  const pdfDocPass2 = (
    <FormattedDocument
      frontCover={meta.cover}
      sections={processedSections}
      tocMap={sortedToc}
      registerSection={registerSection}
      headerText={meta.pageTemplate?.headerText}
      footerText={meta.pageTemplate?.footerText}
      useServer
    />
  );
  const pdfBuffer = await renderToBuffer(pdfDocPass2);
  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=document.pdf"
    }
  });
}

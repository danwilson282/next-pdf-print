// htmlToPdf.tsx
import React from "react";
import { parseDocument } from "htmlparser2";
import { default as serialize } from 'dom-serializer';
import { View, Text, Image as PDFImage, Link } from "@react-pdf/renderer";
import { nodeStyles } from "../styles/nodeStyle";
import { registerSectionType } from "./RenderPdf";
import Heading from "./Heading";
import { renderMathMLToImage } from '@/helpers/mathRenderer';

export function extractTextFromReactNode(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return node.toString();
  }

  if (Array.isArray(node)) {
    return node.map(extractTextFromReactNode).join("");
  }

  if (React.isValidElement(node)) {
    // ✅ Cast as ReactElement<any> to access props safely
    const element = node as React.ReactElement<any>;
    return extractTextFromReactNode(element.props.children);
  }

  return "";
}


function stringToNumberHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Recursively render DOM nodes into React-PDF components */
async function renderNode(
  node: any,
  keyPrefix = "",
  registerSection: registerSectionType,
  useServer: boolean,
  mathRenderer: (mathml: string)=> Promise<{
    base64: string | Blob;
    width: number;
    height: number;
}>
): Promise<React.ReactNode | null> {
  if (!node) return null;

  if (node.type === "text") {
    const txt = (node.data || "").replace(/\s+/g, " ");
    if (!txt.trim()) return null;
    return <Text key={keyPrefix}>{txt}</Text>;
  }

  if (node.type === "tag") {
    const tag = node.name.toLowerCase();

    const childNodes = await Promise.all(
      (node.children || []).map((c: any, i: number) =>
        renderNode(c, `${keyPrefix}_${tag}_${i}`, registerSection,useServer,mathRenderer)
      )
    );
    const children = childNodes.filter(Boolean);

    let subId: string | undefined, uniqueId: string;

    switch (tag) {
      case "a":
        return (
          <Link key={keyPrefix} src={node.attribs.href || ""} style={nodeStyles.link}>
            {children}
          </Link>
        );

      case "h1":
        return <Text key={keyPrefix} style={nodeStyles.heading1}>{children}</Text>;
      case "h2":
        return <Text key={keyPrefix} style={nodeStyles.heading2}>{children}</Text>;

      case "h3":
        subId = keyPrefix.split("_").pop();
        uniqueId = `${keyPrefix}_h3`;
        return (
          <Heading
            key={keyPrefix}
            level="b"
            registerSection={registerSection}
            id={stringToNumberHash(uniqueId)}
            subId={subId}
            style={nodeStyles.heading3}
          >
            {children}
          </Heading>
        );

      case "h4":
        subId = keyPrefix.split("_").pop();
        uniqueId = `${keyPrefix}_h4`;
        return (
          <Text
            key={keyPrefix}
            render={({ pageNumber }) => children}
            style={nodeStyles.heading4}
          />
        );

      case "strong":
      case "b":
        return <Text key={keyPrefix} style={nodeStyles.strong}>{children}</Text>;
      case "em":
      case "i":
        return <Text key={keyPrefix} style={nodeStyles.em}>{children}</Text>;
      case "u":
        return <Text key={keyPrefix} style={nodeStyles.underline}>{children}</Text>;

      case "img": {
        const src = node.attribs?.src || "";
        const width = node.attribs?.width ? Number(node.attribs.width) : 20;
        const height = node.attribs?.height ? Number(node.attribs.height) : 20;
        if (!src) return null;
        return (
          <PDFImage key={keyPrefix} src={src} style={{ ...nodeStyles.inlineImage, width, height }} />
        );
      }

      case "ul":
      case "ol": {
        const isOrdered = tag === "ol";
        const listItems = await Promise.all(
          (node.children || []).filter((c: any) => c.name === "li").map(async (li: any, idx: number) => {
            const liChildren = await Promise.all(
              (li.children || []).map((c: any, i: number) =>
                renderNode(c, `${keyPrefix}_li_${idx}_${i}`, registerSection,useServer,mathRenderer)
              )
            );
            const bullet = isOrdered ? `${idx + 1}. ` : "• ";
            return (
              <View key={`${keyPrefix}_li_${idx}`} style={nodeStyles.listItem}>
                <Text style={nodeStyles.listBullet}>{bullet}</Text>
                <View style={{ flex: 1 }}>
                  {liChildren
                    .filter(Boolean)
                    .map((child, idx) => (
                      <React.Fragment key={`${keyPrefix}_li_child_${idx}`}>{child}</React.Fragment>
                    ))}
                </View>
              </View>
            );
          })
        );
        return <View key={keyPrefix}>{listItems}</View>;
      }

      case "hr":
        return <View key={keyPrefix} style={nodeStyles.hr} />;

      case "table": {
        const extractRows = (nodes: any[]): any[] =>
          nodes.flatMap((node) => {
            if (node.type === "tag") {
              if (node.name === "tr") return [node];
              if (["thead", "tbody", "tfoot"].includes(node.name)) {
                return extractRows(node.children || []);
              }
            }
            return [];
          });

        const rows = extractRows(node.children || []);
        const colCount = Math.max(
          ...rows.map(
            (r: any) =>
              (r.children || []).filter(
                (c: any) => c.type === "tag" && ["td", "th"].includes(c.name)
              ).length
          )
        );
        const colWidth = `${100 / Math.max(1, colCount)}%`;

        return (
          <View key={keyPrefix} style={nodeStyles.table} wrap={false}>
            {await Promise.all(
              rows.map(async (tr: any, rIdx: number) => {
                const cells = tr.children.filter(
                  (c: any) => c.type === "tag" && ["td", "th"].includes(c.name)
                );
                return (
                  <View key={`${keyPrefix}_tr_${rIdx}`} style={nodeStyles.tableRow}>
                    {await Promise.all(
                      cells.map(async (cell: any, cIdx: number) => {
                        const cellChildren = await Promise.all(
                          (cell.children || []).map((c: any, i: number) =>
                            renderNode(c, `${keyPrefix}_tr${rIdx}_c${cIdx}_${i}`, registerSection, useServer,mathRenderer)
                          )
                        );
                        const isHeader = cell.name === "th";
                        return (
                          <View
                            key={`${keyPrefix}_c${cIdx}`}
                            style={{
                              ...nodeStyles.tableCol,
                              ...(isHeader ? nodeStyles.tableHeaderCol : nodeStyles.tableDataCol),
                              width: colWidth,
                            }}
                          >
                            {cellChildren
                              .filter(Boolean)
                              .map((child, idx) => (
                                <React.Fragment key={`${keyPrefix}_child_${idx}`}>{child}</React.Fragment>
                              ))}
                          </View>
                        );
                      })
                    )}
                  </View>
                );
              })
            )}
          </View>
        );
      }

      case "math": {
        try {
          
          const innerMathML = serialize(node)
          const imageData = await mathRenderer(innerMathML);
          // const imageData = await renderMathMLToImage(innerMathML);
          // return (<PDFImage src={imageData.base64} style={{ width: imageData.width, height: imageData.height }} />)
          return <Text>Placeholder</Text>

        } catch (e) {
          console.error("MathML render error", e);
          return <Text key={keyPrefix}>[Math error]</Text>;
        }
      }

      case "p":
      case "div": {
        const isInline = node.children.every((c: any) => {
          return (
            c.type === "text" ||
            (c.type === "tag" && ["a", "span", "strong", "b", "em", "i", "u"].includes(c.name))
          );
        });
        const containerStyle = nodeStyles.paragraph;
        if (isInline) {
          return <Text key={keyPrefix} style={containerStyle}>{children}</Text>;
        } else {
          return <View key={keyPrefix} style={containerStyle}>{children}</View>;
        }
      }

      case "span":
      default:
        return <Text key={keyPrefix}>{children}</Text>;
    }
  }

  return null;
}

export async function renderHtmlToPdfNodes(
  html: string,
  registerSection: registerSectionType,
  useServer: boolean = false,
  mathRenderer: (mathml: string)=> Promise<{
    base64: string | Blob;
    width: number;
    height: number;
}>
): Promise<React.ReactNode[]> {
  const doc = parseDocument(html, { decodeEntities: true });
  const nodes = await Promise.all(
    (doc.children || []).map((n: any, i: number) => renderNode(n, `root_${i}`, registerSection, useServer,mathRenderer))
  );
  return nodes
  .filter(Boolean)
  .map((node, idx) => <React.Fragment key={`node_${idx}`}>{node}</React.Fragment>);
}
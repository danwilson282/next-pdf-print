import {
    ReactNode,
    ReactElement,
    isValidElement,
    Children,
  } from 'react';
  
  export type SectionType = {
    title: string;
    content: ReactNode[];
  };
  
  export function parseSectionsFromReactNodes(nodes: ReactNode): SectionType[] {
    const flatNodes = Children.toArray(nodes);
    const sections: SectionType[] = [];
  
    let currentTitle: string | null = null;
    let currentContent: ReactNode[] = [];
    for (const node of flatNodes) {
      if (isValidElement(node) && node.type === 'h1') {
        const element = node as ReactElement<any>; // ✅ Cast to access props safely
  
        // Save previous section
        if (currentTitle !== null) {
          sections.push({
            title: currentTitle,
            content: currentContent,
          });
        }
  
        // Start new section
        currentTitle = getTextFromReactNode(element.props.children);
        currentContent = [];
      } else {
        currentContent.push(node);
      }
    }
  
    // Add the last section
    if (currentTitle !== null) {
      sections.push({
        title: currentTitle,
        content: currentContent,
      });
    }
  
    return sections;
  }
  
  // ✅ Helper to extract text from any ReactNode
  function getTextFromReactNode(node: ReactNode): string {
    if (typeof node === 'string' || typeof node === 'number') {
      return String(node);
    }
  
    if (Array.isArray(node)) {
      return node.map(getTextFromReactNode).join('');
    }
  
    if (isValidElement(node)) {
      const element = node as ReactElement<any>; // ✅ Cast again to access props
      return getTextFromReactNode(element.props.children);
    }
  
    return '';
  }
  
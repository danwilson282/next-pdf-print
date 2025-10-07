// src/mathjaxToSvg.ts
import { mathjax } from 'mathjax-full/js/mathjax';
import { MathML } from 'mathjax-full/js/input/mathml';
import { SVG } from 'mathjax-full/js/output/svg';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
// import sharp from 'sharp';
// Setup MathJax
const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const mmlInput = new MathML();
const svgOutput = new SVG({ fontCache: 'none' });

const html = mathjax.document('', {
  InputJax: mmlInput,
  OutputJax: svgOutput,
});

/**
 * Convert MathML to SVG string using MathJax
 */
export async function renderMathMLClient(mathml: string): Promise<Blob | string>{
  const node = html.convert(mathml, { display: true });
  const svgString = adaptor.outerHTML(node);
  const match = svgString.match(/<svg[^>]*>[\s\S]*?<\/svg>/);
  const pureSvg = match ? match[0] : '';
  const png = await svgStringToPng(pureSvg);
  return png;

}

async function svgStringToPng(svgString: string): Promise<Blob> {
  // Parse SVG string into a DOM to extract width/height
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = doc.documentElement;

  // Try getting width and height from <svg> attributes
  let width = parseFloat(svgElement.getAttribute("width") || "")*8;
  let height = parseFloat(svgElement.getAttribute("height") || "")*8;
  // Fallback: calculate from viewBox
  if (isNaN(width) || isNaN(height)) {
    const viewBox = svgElement.getAttribute("viewBox");
    if (viewBox) {
      const parts = viewBox.split(" ").map(Number);
      if (parts.length === 4) {
        width = parts[2];
        height = parts[3];
      }
    }
  }

  if (!width || !height) {
    throw new Error("Could not determine SVG size");
  }

  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No canvas context");
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject("Failed to create PNG blob");
        },
        "image/png",
        1.0
      );
    };
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}


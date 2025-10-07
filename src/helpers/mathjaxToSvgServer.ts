// src/mathjaxToSvg.ts
import { mathjax } from 'mathjax-full/js/mathjax';
import { MathML } from 'mathjax-full/js/input/mathml';
import { SVG } from 'mathjax-full/js/output/svg';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import sharp from 'sharp';
// Setup MathJax
const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const mmlInput = new MathML();
const svgOutput = new SVG({ fontCache: 'none' });

const html = mathjax.document('', {
  InputJax: mmlInput,
  OutputJax: svgOutput,
});


export async function renderMathMLServer(mathml: string): Promise<{
  base64: string;
  width: number;
  height: number;
}> {
  const node = html.convert(mathml, { display: true });
  const svgString = adaptor.outerHTML(node);
  const match = svgString.match(/<svg[^>]*>[\s\S]*?<\/svg>/);
  const pureSvg = match ? match[0] : '';

  const { pngBuffer, width, height } = await convertSvgToPngWithSize(pureSvg);

  const base64 = `data:image/png;base64,${pngBuffer.toString('base64')}`;
  return { base64, width, height };
}

export async function convertSvgToPngWithSize(svgString: string): Promise<{
  pngBuffer: Buffer;
  width: number;
  height: number;
}> {
  const svgBuffer = Buffer.from(svgString);

  // Use sharp to extract metadata before rendering
  const metadata = await sharp(svgBuffer).metadata();

  const width = metadata.width ?? 100;  // fallback if undefined
  const height = metadata.height ?? 100;

  const pngBuffer = await sharp(svgBuffer)
    .resize({
      width: width*2,
      height: height*2,
      withoutEnlargement: false, // allow upscaling
    })
    .png()
    .toBuffer();

  return { pngBuffer, width, height };
}


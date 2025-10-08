export async function renderMathMLToImage(mathml: string): Promise<{
    base64: string | Blob;
    width: number;
    height: number;
  }> {
    const isServer = typeof window === 'undefined';
    if (isServer) {
      // const { renderMathMLServer } = await import('./mathjaxToSvgServer');
      // return renderMathMLServer(mathml);
      return {
        base64: "",
        width: 100,
        height: 100,
      }
    } else {
      return {
        base64: "",
        width: 100,
        height: 100,
      }
      // const { renderMathMLClient } = await import('./mathjaxToSvgClient');
      // const svg = await renderMathMLClient(mathml);
      // return {
      //   base64: svg, // You can base64 it if needed
      //   width: 100,
      //   height: 100,
      // };
    }
  }
  
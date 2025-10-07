import React from "react";
import { Document, Page } from "@react-pdf/renderer";
import { renderHtmlToPdfNodes } from "./HtmlParser";

export const htmlExample = `
  <h1>Products</h1>
  <p>This is a paragraph.</p>
  <hr/>
  <table>
    <tr><th>Name</th><th>Image</th></tr>
    <tr>
      <td>Apple</td>
      <td><img src="https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg" width="30" height="30" /></td>
    </tr>
  </table>
`;


// export default function HtmlNodeExample() {
//   return (
//     <Document>
//       <Page size="A4" style={{ padding: 20 }}>
//         {renderHtmlToPdfNodes(htmlExample)}
//       </Page>
//       <Page>
//       </Page>
//     </Document>
//   );
// }
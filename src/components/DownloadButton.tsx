"use client";

import React from "react";
import { DocumentMeta, Section } from "./RenderPdf";

type Props = {
  meta: DocumentMeta;
  sections: Section[];
};

const DownloadPdfButton: React.FC<Props> = ({ meta, sections }) => {
  const downloadPDF = async () => {
    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meta, sections }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // Create a temporary <a> element to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = meta.filename || "document.pdf";
      link.click();

      URL.revokeObjectURL(url); // Clean up
    } catch (err) {
      console.error("Error downloading PDF:", err);
      alert("An error occurred while generating the PDF.");
    }
  };

  return (
    <button onClick={downloadPDF} style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}>
      Download PDF
    </button>
  );
};

export default DownloadPdfButton;

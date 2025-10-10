"use client";
import React, { useEffect, useState } from "react";
import { intro } from "@/AQA/Maths/Introduction";
import { specAtAGlance } from "@/AQA/Maths/specificationAtAGlance";
import { subjectContent } from "@/AQA/Maths/subjectContent";
import { schemeOfAssessment } from "@/AQA/Maths/schemeOfAssessment";
import { generalAdministration } from "@/AQA/Maths/generalAdministration";
import { appendix } from "@/AQA/Maths/appendix";
import backgroundImage from "@/AQA/SampleBackground.png";
import logo from "@/AQA/AQAlogo.png";
import DownloadPdfButton from "@/components/DownloadButton";
import { DocumentMeta } from "@/components/RenderPdf";

export type SectionInputType = {
  title: string;
  content: string;
};

const convertImageUrlToBase64 = async (imageUrl: string): Promise<string> => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Failed to convert image"));
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const sections: SectionInputType[] = [
  { title: "Introduction", content: intro },
  { title: "Specification at a glance", content: specAtAGlance },
  { title: "Scheme of assessment", content: schemeOfAssessment },
  { title: "General administration", content: generalAdministration },
  { title: "Appendix", content: appendix },
];

const Server: React.FC = () => {
  const [meta, setMeta] = useState<DocumentMeta | null>(null);

  useEffect(() => {
    const prepareMeta = async () => {
      const [coverImage, logoImage] = await Promise.all([
        convertImageUrlToBase64(backgroundImage.src),
        convertImageUrlToBase64(logo.src),
      ]);

      const documentMetadata: DocumentMeta = {
        cover: {
          coverImage,
          logo: logoImage,
          headingContainer: {
            heading1: "GCSE",
            heading2: "MATHEMATICS",
            subheading: "(8300)",
            title: "Specification",
            description1: "For teaching from September 2015 onwards",
            description2: "For exams in May/June 2017 onwards",
            subText: "Version 1.0 12 September 2014",
          },
        },
        pageTemplate: {
          headerText:
            "GCSE Mathematics (8300). For exams in May/June 2017 onwards. Version 1.0",
          footerText:
            "Visit aqa.org.uk/8300 for the most up-to-date specifications, resources, support and administration",
        },
      };

      setMeta(documentMetadata);
    };

    prepareMeta();
  }, []);

  if (!meta) return <div>Preparing document...</div>;

  return <DownloadPdfButton meta={meta} sections={sections} />;
};

export default Server;

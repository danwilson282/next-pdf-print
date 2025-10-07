import React from "react";
import { Page, Text, View } from "@react-pdf/renderer";
import type { registerSectionType } from "./RenderPdf";
import { globalStyles } from "../styles/globalStyle";

type Props = {
  title: string;
  content: string | React.ReactNode;
  registerSection: registerSectionType
  headerText?: string;
  footerText?: string;
  id: number;
  useServer: boolean;
}

const Section: React.FC<Props> = ({ title, content, registerSection, headerText, footerText, id, useServer }) => (
  <Page size="A4" style={globalStyles.page}>
        
    <View style={globalStyles.header} fixed>
      <Text></Text>
      <Text
        style={{textAlign: 'right'}}
        render={() =>
          `${headerText && headerText}`
        }
        fixed
      />
      {/* <Text
        style={{textAlign: 'right', fontWeight: 600}}
        render={({ pageNumber, totalPages }) =>
          // `Page ${pageNumber} of ${totalPages}`
        `${pageNumber}`
        }
        fixed
      /> */}
    </View>
    <View style={globalStyles.headerHr} fixed/>
    <View>
      <View style={{ paddingBottom:16}}>
        <View style={globalStyles.headingContainer}>
          <Text
            render={({ pageNumber }) => {
              registerSection(title, pageNumber, id, `${pageNumber}_${id}_a`);
              return `${title}`;
            }}
            style={globalStyles.pageTitle}
          />
          <View style={globalStyles.headingUnderline} />
        </View>
      </View>


      {typeof content === "string" ? <Text>{content}</Text> : content}
    </View>
    <View style={globalStyles.footerHr} fixed/>
    <View style={globalStyles.footer} fixed>
      
      <Text
        style={{textAlign: 'left'}}
        render={() =>
          `${footerText && footerText}`
        }
        fixed
      />
      <Text
        style={{textAlign: 'right', fontWeight: 600}}
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        // `${pageNumber}`
        }
        fixed
      />
    </View>

  </Page>
);

export default Section;

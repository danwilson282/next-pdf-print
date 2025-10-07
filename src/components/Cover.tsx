import { Page, Text, View, Image } from "@react-pdf/renderer";
import { coverStyles } from "../styles/frontCover";
export type HeadingContainer = {
    heading1?: string;
    heading2?: string;
    subheading?: string;
    title?: string;
    description1?: string;
    description2?: string;
    subText?: string;
  }

export type FrontCoverProps = {
  coverImage: string;
  logo: string;
  headingContainer: HeadingContainer
}

export const Cover: React.FC<FrontCoverProps> = ({ coverImage, logo, headingContainer }) => {
    return (
        <Page size="A4" style={coverStyles.page}>
        
            <Image src={coverImage} style={coverStyles.backgroundImage} />
            <View style={coverStyles.content}>
                <Image src={logo} style={coverStyles.logo}/>
                <View style={coverStyles.container}>
                    <View style={coverStyles.hr} />
                    <Text style={coverStyles.heading1}>{headingContainer.heading1}</Text>
                    <Text style={coverStyles.heading2}>{headingContainer.heading2}</Text>
                    <Text style={coverStyles.subheading}>{headingContainer.subheading}</Text>
                    <View style={coverStyles.hr} />
                    <View style={coverStyles.hr} />
                    <Text style={coverStyles.title}>{headingContainer.title}</Text>
                    <Text style={coverStyles.description}>{headingContainer.description1}</Text>
                    <Text style={coverStyles.description}>{headingContainer.description2}</Text>
                    <View style={coverStyles.hr} />
                    <Text style={coverStyles.subText}>{headingContainer.subText}</Text>
                </View>
                
            </View>
        </Page>
    )
}
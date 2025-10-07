import { StyleSheet, Font } from "@react-pdf/renderer";

// Font.register({ 
//   family: 'Open Sans', 
//   src: "https://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3aCWcynf_cDxXwCLxiixG1c.ttf"
//   // fonts: [
//   //   { src: "https://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3aCWcynf_cDxXwCLxiixG1c.ttf", fontWeight: "normal" },
//   //   { src: "https://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3aCWcynf_cDxXwCLxiixG1c.ttf", fontWeight: "bold" },
//   // ],
// });

Font.register({
  family: 'Open Sans',
  fonts: [
  { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
  { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 }
  ]
  });


//AQA Styles
// fontSize 16
// h1 4rem
// h2 2rem
// h3 1.4 rem
// h4 1.2rem
// --aqa-neutral: #2b2438;
// --aqa-purple-primary: #371376;
// --aqa-purple-secondary: #5f4291;
// --aqa-purple-tertiary: #8771ac;
// --aqa-red: #c8194b;
// --aqa-red-60: #de7493;



export const globalStyles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Open Sans" },
  heading: { fontSize: 18, marginBottom: 20, textAlign: "left" },
  tocItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  tocSectionA: {
    fontSize: 12,
    fontWeight: 600,
    color: '#c8194b',
  },
  tocSectionB: {
    marginLeft: 20,
  },
  tocSectionC: {
    marginLeft: 40,
  },
  pageTitle: {
      fontSize: "2rem", 
      color: '#ffffff'  ,
  },
  headingContainer: {
    backgroundColor:  '#371376',
    paddingVertical: 10,
    paddingHorizontal: 6
  },
  headingUnderline: {
    width: '100%',
    height: 1,
    backgroundColor: '#c8194b',
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: '0.8rem',
    color: 'grey',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerHr: {
    position: 'absolute',
    top: 35, // position of the horizontal line
    left: 40,
    right: 40,
    height: 1,
    backgroundColor: '#000',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: '0.8rem',
    color: 'grey',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerHr: {
    position: 'absolute',
    bottom: 35, // position of the horizontal line
    left: 40,
    right: 40,
    height: 1,
    backgroundColor: '#000',
  }
});
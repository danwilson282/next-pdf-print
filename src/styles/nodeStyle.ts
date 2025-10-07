import { StyleSheet } from "@react-pdf/renderer";

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

export const nodeStyles = StyleSheet.create({
  paragraph: { marginBottom: 14 },
  heading1: { fontSize: "4rem", marginBottom: 6, color: '#c8194b' },
  heading2: { fontSize: "2rem", marginBottom: 16, color: '#ffffff'  },
  heading3: { fontSize: "1.4rem", marginTop: 10, marginBottom: 10, color: '#c8194b'},
  heading4: { fontSize: "1.2rem", marginTop: 8, marginBottom: 8, color: '#c8194b'},
  link: { color: 'blue', textDecoration: 'underline' },
  strong: { fontWeight: 600 },
  em: { },
  underline: { textDecoration: "underline" },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    marginVertical: 10
  },

    table: {
      width: "100%",
      borderWidth: 1,
      borderColor: "#000",
      marginBottom: 8,
    },
    tableRow: {
      flexDirection: "row",
    },
    tableCol: {
      flex: 1, // each cell takes equal space
      borderWidth: 0.5,
      borderColor: "#000",
      padding: 4,
      justifyContent: "center",
    },
    tableDataCol: {

    },
    tableHeaderCol: {
      backgroundColor: '#c8194b',
      color: '#ffffff',
    },
    tableCellText: {
      fontSize: 10,
    },

  inlineImage: { width: 20, height: 20, marginRight: 6 },

  listItem: { flexDirection: "row", marginBottom: 6 },
  listBullet: { width: 10 },
});
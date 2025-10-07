import { StyleSheet } from "@react-pdf/renderer";

export const coverStyles = StyleSheet.create({
    page: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    container: {
        paddingTop: 100,
        width: '50%'
    },
    backgroundImage: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '100%',
        objectFit: 'cover', // or 'cover' depending on how you want it to scale
    },
    content: {
        padding: 40,
        position: 'relative',
    },
    logo: {
        width: 100,
    },
    hr: {
        width: '100%',
        height: 1,
        backgroundColor: '#c8194b',
      },
    heading1: { fontSize: "2rem", marginBottom: 3, color: '#371376' },
    heading2: { fontSize: "2rem", marginBottom: 3, color: '#c8194b' },
    subheading: { fontSize: "1rem", marginLeft: 3, marginBottom: 3, color: '#371376' },
    title: { fontSize: "0.8rem", fontWeight: 600, marginLeft: 3, marginBottom: 3, color: '#371376' },
    description: { fontSize: "0.6rem", marginLeft: 6, marginBottom: 3, color: '#371376' },
    subText: { fontSize: "0.4rem", marginLeft: 6, marginBottom: 3, color: '#371376' }
})
import type { DocumentMeta } from "./RenderPdf";
import type { Section } from "./RenderPdf";
import generateSha1 from "../helpers/generateSha1";
import RenderPdf from "./RenderPdf";

type Props = {
    meta: DocumentMeta;
    sections: Section[]
}

const ServePdf: React.FC<Props> = ({meta, sections}) => {
    const sha1 = generateSha1([...sections.map(section=>section.content?.toString()), meta.toString()]);
    //Pass a function that checks the hash and returns 
    // Check if SHA1 hash is matched
    // If matched, serve from cache
    // If not matched, pass blob and store in cache
    return (
        <>
        <div>SHA1: {sha1}</div>
        <RenderPdf meta={meta} sections={sections} />
        </>
        
    );
}

export default ServePdf;
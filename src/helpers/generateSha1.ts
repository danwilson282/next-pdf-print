import SHA1 from "crypto-js/sha1";

const generateSha1 = (sections: string[]): string => {
    const rawHtmlInputs = sections.join("");
    const hash = SHA1(rawHtmlInputs).toString();
    return hash;
}
export default generateSha1;
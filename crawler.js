const axios = require("axios");
const jsdom = require("jsdom");
const fs = require("fs");
const REGEX = new RegExp(/\/\/wiprodigital./, 'i');
const {
    JSDOM
} = jsdom;

const url = "https://wiprodigital.com/";

const getAllLinksInURL = async (url) => {
    try {
        let response = await axios.get(url);
        if (/text\/html/i.test(response.headers['content-type']) && (REGEX.test(url))) {
            const {
                document
            } = new JSDOM(response.data).window;
            let aLinks = document.getElementsByTagName('a');
            let iLinks = document.getElementsByTagName('img');
            let allLinks =[...aLinks,...iLinks]
            return allLinks; 
        } else {
            console.log(url);
            return;
        }
    } catch (error) {
        console.log(url);
    }
};

 const getCleanURL = (url) => {
    if(url){
        url = url.split("#")[0];
        url = url.split("?")[0];
        return url;
    }
};


(async () => {
    let allAcherPoints = await getAllLinksInURL(url) || [];
    let finalURL = [];
    let imgLinks =[];
    let otherDomain = [];
    for (const i of allAcherPoints) {
        if (i.href ){
            let cleanURL = getCleanURL(i.href);
            if (cleanURL && REGEX.test(cleanURL)) {
                if (!finalURL.includes(cleanURL)) {
                    finalURL.push(cleanURL);
                }
            }else if(cleanURL && !REGEX.test(cleanURL) && !otherDomain.includes(cleanURL)){
                console.log("otherlink")
                otherDomain.push(cleanURL);
            } 
        }else if(i.src ){
            let cleanURL = i.src;
            if (cleanURL ) {
               
                if (!finalURL.includes(cleanURL) && !imgLinks.includes(cleanURL) ) {
                    finalURL.push(cleanURL);
                    imgLinks.push(cleanURL);
                }
            }
        }
    }
    for (const i of finalURL) {
        let allLinksInURL = await getAllLinksInURL(i) || [];
        for (const j of allLinksInURL) {
            if (j.href){
                let cleanURL = getCleanURL(j.href);
                if (cleanURL && REGEX.test(cleanURL)) {
                    if (!finalURL.includes(cleanURL)) {
                        finalURL.push(cleanURL);
                    }
                }else if(cleanURL && !REGEX.test(cleanURL) && !otherDomain.includes(cleanURL)){
                    otherDomain.push(cleanURL);
                } 
            }else if(j.src){
                let cleanURL = j.src;
                console.log(cleanURL);
                if (cleanURL) {
                    
                    if (!finalURL.includes(cleanURL) && !imgLinks.includes(cleanURL) ) {
                        finalURL.push(cleanURL);
                        imgLinks.push(cleanURL);
                    }
                }
            }
        }
        console.log(finalURL.length," final");
        console.log(otherDomain.length," other")
    }
    console.log(imgLinks);

    
    // for TXT Sitemap
    for (const i of finalURL) {
        fs.appendFileSync("./sitemap.txt", i + "\n")
    }
    for (const i of otherDomain) {
        fs.appendFileSync("./sitemap.txt", i + "\n")
    }

    // for XML Sitemap
    fs.writeFileSync("./sitemap.xml", `<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`)
    for (const i of finalURL) {
        if(REGEX.test(i)){
            fs.appendFileSync("./sitemap.xml", `
            <url>
                <loc>${i}</loc>
                <lastmod>${new Date()}</lastmod>
                <changefreq>always</changefreq>
                <priority>1.0</priority>
            </url>
                    `)  

        }else{
        fs.appendFileSync("./sitemap.xml", `
<url>
    <image>        
        <loc>${i}</loc>
        <lastmod>${new Date()}</lastmod>
        <changefreq>always</changefreq>
        <priority>1.0</priority>
    </image>
</url>
        `)
    }
    }
    for (const i of otherDomain) {
            fs.appendFileSync("./sitemap.xml", `
            <url>
                <loc>${i}</loc>
                <lastmod>${new Date()}</lastmod>
                <changefreq>always</changefreq>
                <priority>1.0</priority>
            </url>
                    `)  

        }
    fs.appendFileSync("./sitemap.xml", `</urlset>`)
})()


module.exports={
    getAllLinksInURL:getAllLinksInURL,
    getCleanURL:getCleanURL
}   
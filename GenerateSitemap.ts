import SitemapGenerator from 'sitemap-generator'; 

const generator = SitemapGenerator('https://joukomaenpaa.fi', 
                                { stripQuerystring: false, filepath: './public/sitemap.xml', }); // Käynnistä generaattori 
                                generator.start(); // Kuuntele tapahtumia 
                                generator.on('done', () => { console.log('Sivukartta luotu!'); });
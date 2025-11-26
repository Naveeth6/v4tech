const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');

const sitemap = new SitemapStream({ hostname: 'https://v4-tech.in' });

sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
sitemap.write({ url: '/about' });
sitemap.write({ url: '/services' });
sitemap.write({ url: '/contact' });
sitemap.write({ url: '/reviews' });
sitemap.write({ url: '/support' });
sitemap.end();

streamToPromise(sitemap).then(sm =>
  createWriteStream('./public/sitemap.xml').write(sm)
);

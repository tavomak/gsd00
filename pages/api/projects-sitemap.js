import { getProjects, siteUrl } from '@/utils';
import { GET_PROJECTS } from '@/utils/queries/hygraph';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

const sitemapBlog = async (req, res) => {
  const {
    data: { projects },
  } = await getProjects(GET_PROJECTS, ['en']);

  const baseUrl = siteUrl;

  const staticEnPages = projects.map(
    (item) => `${baseUrl}/en/projects/${item.slug}`
  );

  const staticEsPages = projects.map(
    (item) => `${baseUrl}/projects/${item.slug}`
  );

  const staticPages = [...staticEnPages, ...staticEsPages];

  const stream = new SitemapStream({ hostname: `https://${req.headers.host}` });

  res.writeHead(200, {
    'Content-Type': 'application/xml',
  });

  const xmlString = await streamToPromise(
    Readable.from(staticPages).pipe(stream)
  ).then((data) => data.toString());

  res.end(xmlString);
};

export default sitemapBlog;

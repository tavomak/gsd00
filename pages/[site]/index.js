import { getPageBySlug, getProjects, GET_PROJECTS, rateLimit } from '@/utils';
import { GET_PAGE_HOME } from '@/utils/queries/hygraph';
import { sites, getSiteConfig } from '@/config/sites';
import HomeGsd00 from '@/components/Templates/HomeGsd00';
import Home83s from '@/components/Templates/Home83s';

const HOMES = {
  gsd00: HomeGsd00,
  '83s': Home83s,
};

export async function getStaticPaths({ locales }) {
  const siteKeys = Object.keys(sites);
  return {
    paths: locales.flatMap((locale) =>
      siteKeys.map((site) => ({ params: { site }, locale }))
    ),
    fallback: false,
  };
}

export async function getStaticProps({ locale, params }) {
  const siteConfig = getSiteConfig(params.site);
  await rateLimit();
  try {
    const response = await getPageBySlug(GET_PAGE_HOME, 'home', [locale]);
    const data = response?.data?.page || {};
    const filteredHomeProjects = (data.homeProjects || []).filter((project) =>
      (project.categories || []).includes(siteConfig.category)
    );
    const projectsResponse = await getProjects(GET_PROJECTS, [locale]);
    const projects = (projectsResponse?.data?.projects || []).filter(
      (project) => project.categories?.includes(siteConfig.category)
    );
    return {
      props: {
        data: { ...data, homeProjects: filteredHomeProjects },
        projects,
        siteKey: siteConfig.key,
        siteDomain: siteConfig.domain,
      },
      revalidate: 100,
    };
  } catch (error) {
    console.error('Error fetching home page:', error);
    return {
      props: {
        data: {},
        projects: [],
        siteKey: siteConfig.key,
        siteDomain: siteConfig.domain,
      },
      revalidate: 100,
    };
  }
}

const Home = ({ data, projects, siteKey, siteDomain }) => {
  const Template = HOMES[siteKey] || HomeGsd00;
  return <Template data={data} projects={projects} siteDomain={siteDomain} />;
};

export default Home;

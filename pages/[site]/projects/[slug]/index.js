import {
  getProjects,
  getProjectBySlug,
  GET_PROJECT_BY_SLUG,
  GET_PROJECTS,
} from '@/utils';
import { sites, getSiteConfig } from '@/config/sites';
import ProjectDetailGsd00 from '@/components/Templates/ProjectDetailGsd00';
import ProjectDetail83s from '@/components/Templates/ProjectDetail83s';

const DETAILS = {
  gsd00: ProjectDetailGsd00,
  '83s': ProjectDetail83s,
};

export async function getStaticProps({ params, locale }) {
  const { slug } = params;
  const siteConfig = getSiteConfig(params.site);
  try {
    const response = await getProjectBySlug(GET_PROJECT_BY_SLUG, slug, [
      locale,
    ]);
    const data = response?.data?.project || {};
    return {
      props: {
        data,
        siteKey: siteConfig.key,
      },
      revalidate: 100,
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    return {
      props: {
        data: {},
        siteKey: siteConfig.key,
      },
      revalidate: 100,
    };
  }
}

export async function getStaticPaths({ locales, defaultLocale }) {
  try {
    const projectsResponse = await getProjects(
      GET_PROJECTS,
      locales ?? [defaultLocale]
    );
    const projects = projectsResponse?.data?.projects || [];
    const siteEntries = Object.values(sites);
    const paths = locales.flatMap((locale) =>
      siteEntries.flatMap((siteCfg) =>
        projects
          .filter((p) => p.categories?.includes(siteCfg.category))
          .map((p) => ({
            params: { site: siteCfg.key, slug: p.slug },
            locale,
          }))
      )
    );
    return { paths, fallback: true };
  } catch (error) {
    console.error('Error fetching project paths:', error);
    return { paths: [], fallback: true };
  }
}

const Project = ({ data, siteKey }) => {
  const Template = DETAILS[siteKey] || ProjectDetailGsd00;
  return <Template data={data} />;
};

export default Project;

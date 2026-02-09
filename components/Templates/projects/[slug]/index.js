import Layout from '@/components/Templates/Layout';
import Marquee from 'react-fast-marquee';
import VideoIframe from '@/components/Atoms/VideoIframe';

import { getProjects, getProjectBySlug, rateLimit } from '@/utils';

export async function getStaticProps({ params, locale }) {
  await rateLimit();
  const { slug } = params;
  const response = await getProjectBySlug(slug, [locale]);
  const data = response?.data?.project || [];
  return {
    props: {
      data,
    },
    revalidate: 100,
  };
}

export async function getStaticPaths({ locales }) {
  await rateLimit();
  const response = await getProjects(locales);
  const projects = response?.data?.projects || [];
  return {
    paths: projects.map((project) => ({
      params: { slug: `/projects/${project.slug}` },
    })),
    fallback: true,
  };
}

const Project = ({ data }) => (
  <Layout
    title={data?.seoMetaData?.title}
    description={data?.seoMetaData?.description}
  >
    <section className="py-6 overflow-x-hidden lg:py-10">
      <Marquee speed={200}>
        <h2 className="flex gap-4 py-6 text-6xl font-bold 2xl:text-9xl me-20">
          <span> {data?.title} </span>
        </h2>
      </Marquee>
    </section>
    <section className="container mx-auto max-w-screen-xl  mt-8 lg:-mt-[58px] xl:-mt-11 ">
      <div className="mx-4 overflow-hidden border rounded-xl xl:rounded-3xl border-neutral-800">
        <VideoIframe videoId={data?.viemoId} controls />
      </div>
    </section>
  </Layout>
);

export default Project;

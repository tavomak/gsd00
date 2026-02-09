import Layout from '@/components/Templates/Layout';
import { getPageBySlug } from '@/utils';
import RichContent from '@/components/Atoms/RichContent';

export async function getStaticProps(context) {
  const { locale } = context;
  const response = await getPageBySlug('terms-conditions', [locale]);
  const data = response?.data?.page || [];
  return {
    props: {
      data,
    },
    revalidate: 100,
  };
}

const TermsConditions = ({ data }) => (
  <Layout
    title={data?.seoMetaData?.title}
    description={data?.seoMetaData?.description}
  >
    {data?.sections?.map((section) => (
      <section
        key={section?.id}
        className="container flex flex-col justify-between max-w-screen-xl gap-4 px-4 mx-auto mb-10 xl:mb-20 lg:py-10 xl:gap-10 lg:flex-row"
      >
        <div className="lg:w-1/3">
          <h2 className="font-bold lg:text-4xl">{section?.title}</h2>
        </div>
        <div className="lg:w-2/3">
          <RichContent content={section?.content?.json} />
        </div>
      </section>
    ))}
  </Layout>
);

export default TermsConditions;

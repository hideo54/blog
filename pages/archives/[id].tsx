import type { InferGetStaticPropsType, GetStaticPaths, GetStaticPropsContext } from 'next';
import { ChevronBack } from '@styled-icons/ionicons-outline';
import { IconNextLink } from '@hideo54/reactor';
import Layout from '../../components/Layout';
import Archive from '../../components/Archive';
import WrapperWithSidebar from '../../components/WrapperWithSidebar';
import MDXProvider from '../../components/MDXProvider';
import { getArchivesData, getBodySource, getCategoryCounts, getTagCounts } from '../../lib/blog';

export const getStaticPaths: GetStaticPaths = async () => {
    const archivesData = await getArchivesData();
    const ids = archivesData.map(archiveData => archiveData.filename);
    return {
        paths: ids.map(id => ({
            params: {
                id,
            },
        })),
        fallback: false,
    };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
    const id = context.params?.id as string;
    const archivesData = await getArchivesData();
    const archiveData = archivesData.filter(archiveData => archiveData.filename === id)[0];
    const bodySource = await getBodySource(id);
    const categoryCountsSorted = await getCategoryCounts(archivesData);
    const tagCountsSorted = await getTagCounts(archivesData);
    return {
        props: {
            archiveData,
            bodySource,
            categoryCountsSorted,
            tagCountsSorted,
        },
    };
};

const App = ({ archiveData, bodySource, categoryCountsSorted, tagCountsSorted }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <Layout
            title={`${archiveData.data.title} | いうていけろ - hideo54のブログ`}
            imageUrl={archiveData.data.ogp}
            twitterCardType={archiveData.data.ogp ? 'summary' : 'summary_large_image'}
        >
            <WrapperWithSidebar data={{ categoryCountsSorted, tagCountsSorted }}>
                <IconNextLink LeftIcon={ChevronBack} href='/'>トップページ</IconNextLink>
                <Archive
                    key={archiveData.filename}
                    title={archiveData.data.title}
                    date={archiveData.data.date}
                    update={archiveData.data.update || undefined}
                    filename={archiveData.filename}
                    category={archiveData.data.category}
                    tags={archiveData.data.tags}
                >
                    <MDXProvider mdxSource={bodySource} />
                </Archive>
            </WrapperWithSidebar>
        </Layout>
    );
};

export default App;

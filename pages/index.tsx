import type { InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { Archive, PageLinks, WrapperWithSidebar } from '../components/atoms';
import { MDXProvider } from '../components/markdown';
import { getArchivesData, getCategoryCounts, getTagCounts } from '../lib/blog';

export const getStaticProps = async () => {
    const archivesData = await getArchivesData();
    const categoryCountsSorted = await getCategoryCounts(archivesData);
    const tagCountsSorted = await getTagCounts(archivesData);
    return {
        props: {
            archivesData,
            categoryCountsSorted,
            tagCountsSorted,
        },
    };
};

const App = ({ archivesData, categoryCountsSorted, tagCountsSorted }: InferGetStaticPropsType<typeof getStaticProps>) => {
    const router = useRouter();
    const pageNumber = parseInt(router.query.p as string) || 1;
    const numArticlesPerPage = 3;
    const archives = archivesData.slice(numArticlesPerPage * (pageNumber - 1), numArticlesPerPage * pageNumber);
    return (
        <Layout>
            <WrapperWithSidebar data={{ categoryCountsSorted, tagCountsSorted }}>
                {archives.map(archive => (
                    <Archive
                        key={archive.filename}
                        title={archive.data.title}
                        date={archive.data.date}
                        update={archive.data.update}
                        filename={archive.filename}
                        category={archive.data.category}
                        tags={archive.data.tags}
                        isExcerpt={true}
                        showFrame={true}
                    >
                        <MDXProvider mdxSource={archive.excerptSource} />
                    </Archive>
                ))}
                <PageLinks path='/' current={pageNumber} max={Math.ceil(archivesData.length / numArticlesPerPage)} />
            </WrapperWithSidebar>
        </Layout>
    );
};

export default App;

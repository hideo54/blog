import type { InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { Archive, PageLinks } from '../components/atoms';
import { MDXProvider } from '../components/markdown';
import { getArchivesData } from '../lib/blog';

export const getStaticProps = async () => {
    const archivesData = await getArchivesData();
    return {
        props: {
            archivesData,
        },
    };
};

const App = ({ archivesData }: InferGetStaticPropsType<typeof getStaticProps>) => {
    const router = useRouter();
    const pageNumber = parseInt(router.query.p as string) || 1;
    const numArticlesPerPage = 5;
    const archives = archivesData.slice(numArticlesPerPage * (pageNumber - 1), numArticlesPerPage * pageNumber);
    return (
        <Layout>
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
        </Layout>
    );
};

export default App;

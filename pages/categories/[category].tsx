import type { InferGetStaticPropsType, GetStaticPaths, GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import { ChevronBack } from '@styled-icons/ionicons-outline';
import { IconNextLink } from '@hideo54/reactor';
import Layout from '../../components/Layout';
import { Archive, PageLinks } from '../../components/atoms';
import { MDXProvider } from '../../components/markdown';
import { getArchivesData } from '../../lib/blog';

export const getStaticPaths: GetStaticPaths = async () => {
    const archivesData = await getArchivesData();
    const categories = Array.from(
        new Set(
            archivesData.map(archiveData => archiveData.data.category)
        )
    );
    return {
        paths: categories.map(category => ({
            params: {
                category,
            },
        })),
        fallback: false,
    };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
    const category = context.params?.category as string;
    const allArchivesData = await getArchivesData();
    const archivesData = allArchivesData.filter(archiveData =>
        archiveData.data.category === category
    );
    return {
        props: {
            category,
            archivesData,
        },
    };
};

const App = ({ category, archivesData }: InferGetStaticPropsType<typeof getStaticProps>) => {
    const router = useRouter();
    const pageNumber = parseInt(router.query.p as string) || 1;
    const numArticlesPerPage = 5;
    const archives = archivesData.slice(numArticlesPerPage * (pageNumber - 1), numArticlesPerPage * pageNumber);
    return (
        <Layout title={`カテゴリ: ${category} | いうていけろ - hideo54のブログ`}>
            <IconNextLink LeftIcon={ChevronBack} href='/categories'>カテゴリ一覧</IconNextLink>
            <h2>「{category}」記事の一覧 ({archivesData.length}件)</h2>
            {archives.map(archive => (
                <Archive
                    key={archive.filename}
                    title={archive.data.title}
                    date={archive.data.date}
                    update={archive.data.update || undefined}
                    filename={archive.filename}
                    category={archive.data.category}
                    tags={archive.data.tags}
                    isExcerpt={true}
                    showFrame={true}
                >
                    <MDXProvider mdxSource={archive.excerptSource} />
                </Archive>
            ))}
            <PageLinks path={`/categories/${category}`} current={pageNumber} max={Math.ceil(archivesData.length / numArticlesPerPage)} />
        </Layout>
    );
};

export default App;

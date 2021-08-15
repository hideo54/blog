import type { InferGetStaticPropsType, GetStaticPaths, GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import { ChevronBack } from '@styled-icons/ionicons-outline';
import Layout from '../../components/Layout';
import { Archive, IconLink, PageLinks } from '../../components/atoms';
import { MDXProvider } from '../../components/markdown';
import { getArchivesData } from '../../lib/blog';

export const getStaticPaths: GetStaticPaths = async () => {
    const archivesData = await getArchivesData();
    const tags = Array.from(
        new Set(
            archivesData.map(archiveData => archiveData.data.tags).flat()
        )
    );
    return {
        paths: tags.map(tag => ({
            params: {
                tag,
            },
        })),
        fallback: false,
    };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
    const tag = context.params?.tag as string;
    const allArchivesData = await getArchivesData();
    const archivesData = allArchivesData.filter(archiveData =>
        archiveData.data.tags.includes(tag)
    );
    return {
        props: {
            tag,
            archivesData,
        },
    };
};

const App = ({ tag, archivesData }: InferGetStaticPropsType<typeof getStaticProps>) => {
    const router = useRouter();
    const pageNumber = parseInt(router.query.p as string) || 1;
    const numArticlesPerPage = 5;
    const archives = archivesData.slice(numArticlesPerPage * (pageNumber - 1), numArticlesPerPage * pageNumber);
    return (
        <Layout title={`タグ: ${tag} | いうていけろ - hideo54のブログ`}>
            <IconLink LeftIcon={ChevronBack} href='/'>トップページ</IconLink>
            <h2>タグ「{tag}」が付けられた記事の一覧 ({archivesData.length}件)</h2>
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
            <PageLinks path={`/tags/${tag}`} current={pageNumber} max={Math.ceil(archivesData.length / numArticlesPerPage)} />
        </Layout>
    );
};

export default App;

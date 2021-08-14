import type { InferGetStaticPropsType, GetStaticPaths } from 'next';
import { ChevronBack } from '@styled-icons/ionicons-outline';
import Layout from '../../components/Layout';
import { Archive, IconLink } from '../../components/atoms';
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

export const getStaticProps = async context => {
    const tag = context.params.tag as string;
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
    return (
        <Layout title={`タグ: ${tag} | いうていけろ - hideo54のブログ`}>
            <IconLink LeftIcon={ChevronBack} href='/'>トップページ</IconLink>
            <h2>タグ「{tag}」が付けられた記事の一覧</h2>
            {archivesData.map(archive => (
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
        </Layout>
    );
};

export default App;

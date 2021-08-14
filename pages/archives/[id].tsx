import type { InferGetStaticPropsType, GetStaticPaths } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { ChevronBack } from '@styled-icons/ionicons-outline';
import Layout from '../../components/Layout';
import { Archive, IconLink } from '../../components/atoms';
import { MDXProvider } from '../../components/markdown';
import { getArchivesData, getBodySource } from '../../lib/blog';

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

export const getStaticProps = async context => {
    const id = context.params.id as string;
    const archivesData = await getArchivesData();
    const archiveData = archivesData.filter(archiveData => archiveData.filename === id)[0];
    const bodySource = await getBodySource(id);
    return {
        props: {
            archiveData,
            bodySource,
        },
    };
};

const App = ({ archiveData, bodySource }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <Layout title={`${archiveData.data.title} | いうていけろ - hideo54のブログ`}>
            <IconLink LeftIcon={ChevronBack} href='/'>トップページ</IconLink>
            <Archive
                key={archiveData.filename}
                title={archiveData.data.title}
                date={archiveData.data.date}
                update={archiveData.data.update}
                filename={archiveData.filename}
                category={archiveData.data.category}
                tags={archiveData.data.tags}
            >
                <MDXProvider mdxSource={bodySource} />
            </Archive>
        </Layout>
    );
};

export default App;

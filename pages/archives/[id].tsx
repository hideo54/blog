import type { InferGetStaticPropsType, GetStaticPaths } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import fs from 'fs/promises';
import matter from 'gray-matter';
import Layout from '../../components/Layout';
import { Archive } from '../../components/atoms';
import { MDXProvider } from '../../components/markdown';
import { stringifyDate } from '../../lib/utils';

export const getStaticPaths: GetStaticPaths = async () => {
    const archivesDir = './archives/';
    const archiveFilenames = await fs.readdir(archivesDir);
    return {
        paths: archiveFilenames.map(filename => ({
            params: {
                id: filename.split('.')[0],
            },
        })),
        fallback: false,
    };
};

export const getStaticProps = async context => {
    const id = context.params.id as string;
    const archivePath = `./archives/${id}.mdx`;
    const fileText = await fs.readFile(archivePath, 'utf-8');
    const file = matter(fileText);
    const data = file.data as ArchiveData;
    const serializableData: SerializableArchiveData = {
        ...data,
        date: stringifyDate(data.date),
        update: data.update ? stringifyDate(data.update) : null,
    };
    const bodySource = await serialize(file.content);
    return {
        props: {
            data: serializableData,
            filename: id,
            bodySource,
        },
    };
};

const App = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <Layout title={`${props.data.title} | いうていけろ - hideo54のブログ`}>
            <Archive
                key={props.filename}
                title={props.data.title}
                filename={props.filename}
                category={props.data.category}
            >
                <MDXProvider mdxSource={props.bodySource} />
            </Archive>
        </Layout>
    );
};

export default App;

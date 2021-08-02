import { InferGetStaticPropsType } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import fs from 'fs/promises';
import matter from 'gray-matter';
import Layout from '../components/Layout';
import { Archive } from '../components/atoms';
import { MDXProvider } from '../components/markdown';
import { stringifyDate } from '../lib/utils';

export const getStaticProps = async () => {
    const archivesDir = './archives/';
    const archiveFilenames = await fs.readdir(archivesDir);
    const archivesData = await Promise.all(
        archiveFilenames.map(filename =>
            fs.readFile(archivesDir + filename, 'utf-8').then(d => {
                const file = matter(d, {
                    excerpt: true,
                });
                const data = file.data as ArchiveData;
                const serializableData: SerializableArchiveData = {
                    ...data,
                    date: stringifyDate(data.date),
                    update: data.update ? stringifyDate(data.update) : null,
                };
                const excerptSourcePromise = serialize(file.excerpt);
                return Promise.all([ serializableData, excerptSourcePromise ]);
            }).then(([ data, excerptSource ]) => ({
                data, excerptSource,
                filename: filename.split('.')[0],
            }))
        )
    );
    return {
        props: {
            archivesData,
        },
    };
};

const App = ({ archivesData }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <Layout>
            {archivesData.map(archive => (
                <Archive
                    key={archive.filename}
                    title={archive.data.title}
                    filename={archive.filename}
                    category={archive.data.category}
                    isExcerpt={true}
                >
                    <MDXProvider mdxSource={archive.excerptSource} />
                </Archive>
            ))}
        </Layout>
    );
};

export default App;

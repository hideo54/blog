import type { InferGetStaticPropsType } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import dayjs from 'dayjs';
import fs from 'fs/promises';
import matter from 'gray-matter';
import Layout from '../components/Layout';
import { Archive } from '../components/atoms';
import { MDXProvider } from '../components/markdown';

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
                    date: data.date.toISOString(),
                    update: data.update ? data.update?.toISOString() : null,
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
    archivesData.sort((a, b) => dayjs(a.data.date) > dayjs(b.data.date) ? -1 : 1)
    return (
        <Layout>
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

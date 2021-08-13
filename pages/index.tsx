import type { InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { serialize } from 'next-mdx-remote/serialize';
import dayjs from 'dayjs';
import fs from 'fs/promises';
import matter from 'gray-matter';
import Layout from '../components/Layout';
import { Archive, PageLinks } from '../components/atoms';
import { MDXProvider } from '../components/markdown';

export const getStaticProps = async () => {
    const archivesDir = './archives/';
    const archiveFilenames = await fs.readdir(archivesDir);
    const archivesData = await Promise.all(
        archiveFilenames.filter(filename => filename.endsWith('.mdx')).map(filename =>
            fs.readFile(archivesDir + filename, 'utf-8').then(d => {
                const file = matter(d, {
                    excerpt: true,
                    excerpt_separator: '<!-- more -->',
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
    const router = useRouter();
    const pageNumber = parseInt(router.query.p as string) || 1;
    archivesData.sort((a, b) => dayjs(a.data.date) > dayjs(b.data.date) ? -1 : 1);
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
            <PageLinks current={pageNumber} max={Math.ceil(archivesData.length / numArticlesPerPage)} />
        </Layout>
    );
};

export default App;

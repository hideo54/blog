import type { InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { Feed } from 'feed';
import fs from 'fs/promises';
import Layout from '../components/Layout';
import Archive from '../components/Archive';
import PageLinks from '../components/PageLinks';
import WrapperWithSidebar from '../components/WrapperWithSidebar';
import MDXProvider from '../components/MDXProvider';
import { getArchivesData, getCategoryCounts, getTagCounts } from '../lib/blog';

export const getStaticProps = async () => {
    const archivesData = await getArchivesData();
    const categoryCountsSorted = await getCategoryCounts(archivesData);
    const tagCountsSorted = await getTagCounts(archivesData);
    const feed = new Feed({
        title: 'いうていけろ',
        description: 'hideo54のブログ',
        id: 'https://blog.hideo54.com',
        language: 'ja',
        copyright: 'hideo54',
        image: 'https://img.hideo54.com/icons/main.png',
        updated: new Date(
            archivesData.map(
                archiveData => archiveData.data.date
            ).sort().reverse()[0]
        ),
        generator: 'https://github.com/hideo54/blog',
        feedLinks: {
            atom: 'https://blog.hideo54.com/atom.xml',
        },
        author: {
            name: 'hideo54',
            email: 'contact@hideo54.com',
            link: 'https://hideo54.com',
        },
    });
    archivesData.forEach(archiveData => {
        const link = `https://blog.hideo54.com/archives/${archiveData.filename}`;
        feed.addItem({
            title: archiveData.data.title,
            id: link,
            link,
            description: archiveData.excerptMarkdown,
            date: new Date(archiveData.data.date),
        });
    });
    await fs.writeFile('public/atom.xml', feed.atom1());
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
                <PageLinks path='/' current={pageNumber} max={Math.ceil(archivesData.length / numArticlesPerPage)} />
            </WrapperWithSidebar>
        </Layout>
    );
};

export default App;

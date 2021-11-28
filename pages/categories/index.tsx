import type { InferGetStaticPropsType } from 'next';
import styled from 'styled-components';
import { ChevronBack, Folder } from '@styled-icons/ionicons-outline';
import { IconNextLink } from '@hideo54/reactor';
import { countBy } from 'lodash';
import dayjs from 'dayjs';
import Layout from '../../components/Layout';
import { getArchivesData } from '../../lib/blog';

export const getStaticProps = async () => {
    const archivesData = await getArchivesData();
    const categories = archivesData.map(archiveData => archiveData.data.category);
    const categoryCount = countBy(categories);
    const categoryCountsSorted = Object.entries(categoryCount).sort((a, b) =>
        a[1] < b[1] ? 1 : -1
    ).map(([category, categoryCount]) => ({
        category, categoryCount,
        latest: dayjs(
            archivesData.filter(
                archiveData => archiveData.data.category === category
            )[0].data.date
        ).format('YYYY年M月D日'),
    }));
    return {
        props: {
            categoryCountsSorted,
        },
    };
};

const Ul = styled.ul`
    padding-left: 0;
`;

const NoMarkLi = styled.li`
    display: inline-block;
    margin: 1em;
    padding: 1em;
    border-radius: 20px;
    list-style: none;
    box-shadow: 0 0 10px #CCCCCC;
    @media (prefers-color-scheme: dark) {
        background-color: #111111;
        box-shadow: 0 0 10px #444444;
    }
`;

const App = ({ categoryCountsSorted }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <Layout title='カテゴリ一覧 | いうていけろ - hideo54のブログ'>
            <IconNextLink LeftIcon={ChevronBack} href='/'>トップページ</IconNextLink>
            <h2>カテゴリ一覧</h2>
            <Ul>
                {categoryCountsSorted.map(categoryCount => (
                    <NoMarkLi key={categoryCount.category}>
                        <IconNextLink LeftIcon={Folder} href={`/categories/${categoryCount.category}`}>
                            {categoryCount.category} ({categoryCount.categoryCount})
                        </IconNextLink>
                        <br />
                        <span>最新: {categoryCount.latest}</span>
                    </NoMarkLi>
                ))}
            </Ul>
        </Layout>
    );
};

export default App;

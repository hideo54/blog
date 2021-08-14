import type { InferGetStaticPropsType } from 'next';
import styled from 'styled-components';
import { ChevronBack, Folder } from '@styled-icons/ionicons-outline';
import { countBy } from 'lodash';
import dayjs from 'dayjs';
import Layout from '../../components/Layout';
import { IconLink } from '../../components/atoms';
import { getArchivesData } from '../../lib/blog';

export const getStaticProps = async () => {
    const archivesData = await getArchivesData();
    const categories = archivesData.map(archiveData => archiveData.data.category);
    const categoryCount = countBy(categories);
    const categoryCountsSorted = Object.entries(categoryCount).sort((a, b) =>
        a[1] < b[1] ? 1 : -1
    ).map(([ category, categoryCount ]) => ({
        category, categoryCount,
        latest: dayjs(
            archivesData.filter(
                archiveData => archiveData.data.category === category
            )[0].data.date
        ).format('YYYY年M月D日'),
    }));
    console.log(categoryCountsSorted);
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
    box-shadow: 0 0 10px #CCCCCC;
    list-style: none;
`;

const App = ({ categoryCountsSorted }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <Layout title='カテゴリ一覧 | いうていけろ - hideo54のブログ'>
            <IconLink LeftIcon={ChevronBack} href='/'>トップページ</IconLink>
            <h2>カテゴリ一覧</h2>
            <Ul>
                {categoryCountsSorted.map(categoryCount => (
                    <NoMarkLi key={categoryCount.category}>
                        <IconLink LeftIcon={Folder} href={`/categories/${categoryCount.category}`}>
                            {categoryCount.category} ({categoryCount.categoryCount})
                        </IconLink>
                        <br />
                        <span>最新: {categoryCount.latest}</span>
                    </NoMarkLi>
                ))}
            </Ul>
        </Layout>
    );
};

export default App;

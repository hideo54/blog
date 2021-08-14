import type { InferGetStaticPropsType } from 'next';
import styled from 'styled-components';
import { Close } from '@styled-icons/ionicons-outline';
import { countBy } from 'lodash';
import dayjs from 'dayjs';
import Layout from '../../components/Layout';
import { IconLink, Tag } from '../../components/atoms';
import { getArchivesData } from '../../lib/blog';

export const getStaticProps = async () => {
    const archivesData = await getArchivesData();
    archivesData.sort((a, b) =>
        dayjs(a.data.date) < dayjs(b.data.date) ? 1 : -1
    );
    const tags = archivesData.map(archiveData => archiveData.data.tags);
    const tagCount = countBy(tags.flat());
    const tagCountsSorted = Object.entries(tagCount).sort((a, b) =>
        a[1] < b[1] ? 1 : -1
    ).filter(([ , tagCount ]) => tagCount > 1)
    .map(([ tag, tagCount ]) => ({
        tag, tagCount,
        latest: dayjs(
            archivesData.filter(
                archiveData => archiveData.data.tags.includes(tag)
            )[0].data.date
        ).format('YYYY年M月D日'),
    }));
    return {
        props: {
            tagCountsSorted,
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

const App = ({ tagCountsSorted }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <Layout>
            <h2>タグ一覧</h2>
            <p>2回以上使われているタグのみを表示しています。</p>
            <Ul>
                {tagCountsSorted.map(tagCount => (
                    <NoMarkLi key={tagCount.tag}>
                        <Tag>{tagCount.tag}</Tag>
                        <IconLink LeftIcon={Close} href={`/tags/${tagCount.tag}`}>
                            {tagCount.tagCount}
                        </IconLink>
                        <br />
                        <span>最新: {tagCount.latest}</span>
                    </NoMarkLi>
                ))}
            </Ul>
        </Layout>
    );
};

export default App;

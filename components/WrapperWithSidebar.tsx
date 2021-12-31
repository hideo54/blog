import styled from 'styled-components';
import { Folder, Open } from '@styled-icons/ionicons-outline';
import { IconAnchor, IconNextLink } from '@hideo54/reactor';
import Tag from './Tag';

const WrapperDiv = styled.div`
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    flex-wrap: wrap;
    align-items: flex-start;
    @media (min-width: 881px) {
        aside {
            width: 30%;
            margin-right: 1em;
        }
        .main {
            width: 65%;
            margin-left: 1em;
        }
    }
    @media (max-width: 880px) {
        aside {
            width: 100%;
            margin-right: 1em;
        }
        .main {
            width: 100%;
        }
    }
`;

const FrameDiv = styled.div`
    margin: 2em 0;
    padding: 1em;
    border-radius: 20px;
    box-shadow: 0 0 10px #CCCCCC;
    @media (prefers-color-scheme: dark) {
        background-color: #111111;
        box-shadow: 0 0 10px #444444;
    }
`;

const Ul = styled.ul<{ inlineBlockLi?: boolean }>`
    padding-left: 0;
    li {
        list-style: none;
        ${props => props.inlineBlockLi && `
            display: inline-block;
        `}
    }
`;

const WrapperWithSidebar: React.FC<{
    data: {
        categoryCountsSorted: {
            category: string;
            categoryCount: number;
            latest: string;
        }[];
        tagCountsSorted: {
            tag: string;
            tagCount: number;
            latest: string;
        }[];
    };
}> = ({ children, data }) => {
    const introColumn = (
        <FrameDiv>
            <h2>hideo54</h2>
            <p>
                情報技術や社会が好きな学生です。
                <br />
                詳しくは <IconAnchor RightIcon={Open} href='https://hideo54.com'>hideo54.com</IconAnchor> へ。
            </p>
            <p>
                Twitter: <IconAnchor RightIcon={Open} href='https://twitter.com/hideo54'>@hideo54</IconAnchor>
            </p>
        </FrameDiv>
    );
    const categoriesColumn = (
        <FrameDiv>
            <h2>カテゴリ</h2>
            <Ul>
                {data.categoryCountsSorted.map(categoryCount => (
                    <li key={categoryCount.category}>
                        <IconNextLink LeftIcon={Folder} href={`/categories/${categoryCount.category}`}>
                            {categoryCount.category} ({categoryCount.categoryCount})
                        </IconNextLink>
                        <br />
                        <span>最新: {categoryCount.latest}</span>
                    </li>
                ))}
            </Ul>
        </FrameDiv>
    );
    const tagsColumn = (
        <FrameDiv>
            <h2>タグ</h2>
            <Ul inlineBlockLi>
                {data.tagCountsSorted.map(tagCount => (
                    <li key={tagCount.tag}>
                        <Tag>
                            {tagCount.tag}
                        </Tag>
                    </li>
                ))}
            </Ul>
        </FrameDiv>
    );
    return (
        <WrapperDiv>
            <div className='main'>
                {children}
            </div>
            <aside>
                {introColumn}
                {categoriesColumn}
                {tagsColumn}
            </aside>
        </WrapperDiv>
    );
};

export default WrapperWithSidebar;

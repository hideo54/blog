import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import type { StyledIcon } from '@styled-icons/styled-icon';
import { Folder, Calendar, Open } from '@styled-icons/ionicons-outline';
import { Twitter } from '@styled-icons/fa-brands';
import dayjs, { Dayjs } from 'dayjs';
import qs from 'querystring';

export const IconLink: React.FC<{
    LeftIcon?: StyledIcon;
    RightIcon?: StyledIcon;
    href: string;
}> = ({ children, LeftIcon, RightIcon, href }) => {
    const left = LeftIcon && <LeftIcon size={'1.2em'} style={{
        verticalAlign: 'text-bottom',
        marginRight: '0.2em',
    }} />;
    const right = RightIcon && <RightIcon size={'1.2em'} style={{
        verticalAlign: 'text-bottom',
        marginLeft: '0.2em',
    }} />;
    if (href.startsWith('/')) {
        return (
            <Link href={href}>
                <a>
                    {left}
                    {children}
                    {right}
                </a>
            </Link>
        );
    }
    return (
        <a href={href} target='_blank' rel="noreferrer">
            {left}
            {children}
            {right}
        </a>
    );
};

const ArchiveArticle = styled.article<{ showFrame: boolean; }>`
    ${props => props.showFrame ? `
        margin: 2em 0;
        padding: 1em;
        border-radius: 20px;
        box-shadow: 0 0 10px #CCCCCC;
    ` : `
        margin: 1em 0;
    `}

    h2.title {
        margin-top: 0.5em;
        font-feature-settings: 'palt'; // Proportional Alternate Widths. cf. https://helpx.adobe.com/jp/fonts/user-guide.html/jp/fonts/using/open-type-syntax.ug.html#palt
    }

    section {
        margin: 1em 0;
    }
`;

const CautionP = styled.p`
    color: #DA0808;
`;

const TagSpan = styled.span`
    display: inline-block;
    position: relative;
    margin: 4px 12px;
    padding: 4px 8px;
    border: 2px solid #0091EA;
    border-left: none;
    border-radius: 4px;
    cursor: pointer;
    color: #0091EA;
    &::before {
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        width: 1em;
        height: 1em;
        transform: translateX(-6px) translateY(3px) rotate(45deg) scale(1.2);
        border-left: 2px solid #0091EA;
        border-bottom: 2px solid #0091EA;
        border-radius: 4px;
    }
`;

export const Tag: React.FC = ({ children }) => (
    <Link href={`/tags/${children}`}>
        <a>
            <TagSpan>{children}</TagSpan>
        </a>
    </Link>
);

const ShareButtonSpan = styled.span`
    margin-right: 8px;
`;

const TweetButton: React.FC<{ text: string; url: string; }> = ({ text, url }) => {
    const [twttrSupported, setTwttrSupported] = useState(false);
    const containerElement = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        // @ts-expect-error twttr
        if (!twttr.widgets) return;
        setTwttrSupported(true);
        // @ts-expect-error twttr
        twttr.widgets.createShareButton(url, containerElement.current, {
            text,
            lang: 'ja',
        });
        // https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/javascript-factory-function
    }, [text, url]);
    return twttrSupported ? (
        <ShareButtonSpan ref={containerElement} />
    ) : (
        <ShareButtonSpan ref={containerElement}>
            <IconLink LeftIcon={Twitter} href={`https://twitter.com/intent/tweet?${qs.stringify({ text, url })}`}>
                ツイート
            </IconLink>
        </ShareButtonSpan>
    );
};

const HatenaBookmarkButton: React.FC<{ path: string; }> = ({ path }) => (
    // https://b.hatena.ne.jp/guide/bbutton
    <ShareButtonSpan>
        <a
            href={`https://b.hatena.ne.jp/entry/s/blog.hideo54.com${path}`}
            className='hatena-bookmark-button'
            data-hatena-bookmark-layout='basic-label-counter'
            data-hatena-bookmark-lang='ja'
            title='このエントリーをはてなブックマークに追加'
        >
            <img
                src='https://b.st-hatena.com/images/v4/public/entry-button/button-only@2x.png'
                alt='このエントリーをはてなブックマークに追加'
                width='20'
                height='20'
                style={{ border: 'none' }}
            />
        </a>
    </ShareButtonSpan>
);

export const Archive: React.FC<{
    title: string;
    date: string | Dayjs;
    update?: string | Dayjs;
    filename: string;
    category: string;
    tags: string[];
    isExcerpt?: boolean;
    showFrame?: boolean;
}> = props => {
    const update = props.update || props.date;
    const isExcerpt = props.isExcerpt || false;
    const showFrame = props.showFrame || false;
    const Share = () => (
        <div style={{ display: 'flex' }}>
            <TweetButton
                text={`${props.title} | いうていけろ - hideo54のブログ`}
                url={`https://blog.hideo54.com/archives/${props.filename}`}
            />
            <HatenaBookmarkButton path={`/archives/${props.filename}`} />
        </div>
    );
    return (
        <ArchiveArticle showFrame={showFrame}>
            <b>
                <IconLink href={'/categories/' + props.category} LeftIcon={Folder}>{props.category}</IconLink>
            </b>
            <h2 className='title'>
                <Link href={'/archives/' + props.filename}>
                    <a>
                        {props.title}
                    </a>
                </Link>
            </h2>
            <section>
                <IconLink href={'/archives?month=' + dayjs(props.date).format('YYYY-MM')} LeftIcon={Calendar}>
                    {dayjs(props.date).format('YYYY年M月')}
                </IconLink>
                <span>
                    {dayjs(props.date).format('D日')}
                    {update !== props.date && ` (最終更新: ${dayjs(update).format('YYYY年M月D日')})`}
                </span>
                {dayjs() > dayjs(update).add(6, 'months') && (
                    <CautionP>
                        この記事は最終更新から半年以上経過しており、内容が古い可能性があります。
                    </CautionP>
                )}
            </section>
            <section>
                {props.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
            </section>
            <Share />
            <hr color='#0091EA' />
            <section>
                {props.children}
            </section>
            {isExcerpt ? (
                <Link href={'/archives/' + props.filename}>
                    <a>続きを読む</a>
                </Link>
            ) : (
                <>
                    <hr color='#0091EA' />
                    <Share />
                </>
            )}
        </ArchiveArticle>
    );
};

const PageLinksDiv = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 4em;
    div {
        width: 40px;
        height: 40px;
        margin: 0.5em;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.2em;
        &.abbr {
            cursor: default;
        }
        &:not(.abbr) {
            &.current {
                border: 2px solid #0091EA;
                color: white;
                background-color: #0091EA;
                cursor: default;
            }
            &:not(.current) {
                border: 2px solid #0091EA;
                color: #0091EA;
                cursor: pointer;
            }
        }
    }
`;

const PageLink: React.FC<{
    path: string;
    abbr?: boolean;
    current?: boolean;
}> = ({ children, path, abbr = false, current = false }) => (
    abbr ? (
        <div className='abbr'>…</div>
    ) : (
        <Link href={children === '1' ? path : `${path}?p=${children}`}>
            <a>
                <div className={current ? 'current' : ''}>{children}</div>
            </a>
        </Link>
    )
);

export const PageLinks: React.FC<{
    path: string;
    current: number;
    max: number;
}> = ({ path, current, max }) => {
    return (
        <PageLinksDiv>
            <PageLink path={path} current={current === 1}>1</PageLink>
            {current > 3 && <PageLink path={path} abbr />}
            {current > 2 && <PageLink path={path}>{current - 1}</PageLink>}
            {current > 1 && <PageLink path={path} current>{current}</PageLink>}
            {current < max && <PageLink path={path}>{current + 1}</PageLink>}
            {current < max - 1 && <PageLink path={path} abbr />}
        </PageLinksDiv>
    );
};

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
    }
`;

const FrameDiv = styled.div`
    margin: 2em 0;
    padding: 1em;
    border-radius: 20px;
    box-shadow: 0 0 10px #CCCCCC;
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

export const WrapperWithSidebar: React.FC<{
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
                詳しくは <IconLink RightIcon={Open} href='https://hideo54.com'>hideo54.com</IconLink> へ。
            </p>
            <p>
                Twitter: <IconLink RightIcon={Open} href='https://twitter.com/hideo54'>@hideo54</IconLink>
            </p>
        </FrameDiv>
    );
    const categoriesColumn = (
        <FrameDiv>
            <h2>カテゴリ</h2>
            <Ul>
                {data.categoryCountsSorted.map(categoryCount => (
                    <li key={categoryCount.category}>
                        <IconLink LeftIcon={Folder} href={`/categories/${categoryCount.category}`}>
                            {categoryCount.category} ({categoryCount.categoryCount})
                        </IconLink>
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

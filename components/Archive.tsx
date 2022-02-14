import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Folder, Calendar, ChevronForward } from '@styled-icons/ionicons-outline';
import { Twitter } from '@styled-icons/fa-brands';
import { IconSpan, IconAnchor, IconNextLink } from '@hideo54/reactor';
import dayjs, { Dayjs } from 'dayjs';
import qs from 'querystring';
import Tag from './Tag';

const ShareButtonsDiv = styled.div`
    display: flex;
    margin: 1em 0;
`;

const ShareButtonSpan = styled.span<{
    enableTwitterStyle?: boolean;
}>`
    margin-right: 8px;
    height: 20px;
    display: flex;
    align-items: center;
    ${props => props.enableTwitterStyle ? `
        background-color: #00acee;
        border-radius: 3px;
        font-size: 0.7em;
        font-weight: bold;
        padding: 0 8px;
        &:hover {
            background-color: #0d93e6;
        }
        a {
            text-decoration: none;
        }
    `: ''}
`;

const TweetButton: React.FC<{ text: string; url: string; }> = ({ text, url }) => {
    const [twttrSupported, setTwttrSupported] = useState(false);
    const containerElement = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        if (!containerElement.current) return;
        // @ts-expect-error twttr
        if (!twttr.widgets) return;
        setTwttrSupported(true);
        // @ts-expect-error twttr
        twttr.widgets.createShareButton(url, containerElement.current, {
            text,
            lang: 'ja',
        });
        // https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/javascript-factory-function
    }, [containerElement, text, url]);
    return twttrSupported ? (
        <ShareButtonSpan ref={containerElement} />
    ) : (
        <ShareButtonSpan enableTwitterStyle>
            <IconAnchor
                LeftIcon={Twitter}
                href={`https://twitter.com/intent/tweet?${qs.stringify({ text, url })}`}
                color='white'
            >
                ツイート
            </IconAnchor>
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

const HatenaStarSpan = styled.span<{ color: typeof colors[number]['color']}>`
    vertical-align: top;
    color: ${props => colors.filter(color => color.name === props.color)[0].color};
    cursor: pointer;
`;

const HatenaStarButton: React.FC<{ path: string; }> = ({ path }) => {
    // http://developer.hatena.ne.jp/ja/documents/star/apis/entry
    interface Star {
        name: string;
        quote: string;
        count?: number;
        color: string; // 'normal', 'green', 'red', 'blue'
    }
    const [stars, setStars] = useState<Star[]>([]);
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') return;
        (async () => {
            const response = await fetch(`/api/hatena-stars?path=${path}`);
            const res = await response.json() as {
                ok: boolean;
                allStars: Star[];
            };
            if (res.ok) setStars(res.allStars);
        })();
    }, []);
    return (
        <ShareButtonSpan>
            <img
                src='https://cdn.blog.st-hatena.com/images/theme/star/hatena-star-add-button.svg'
                alt='Add Hatena Star'
                style={{
                    cursor: 'pointer',
                    marginRight: '4px',
                }}
                onClick={() => {
                    const url = encodeURIComponent('https://blog.hideo54.com' + path);
                    window.open('https://s.hatena.ne.jp/star.add?uri=' + url, '_blank')?.focus();
                }}
            />
            {stars.map((star, i) =>
                <HatenaStarSpan key={i} color={star.color}>
                    ★
                </HatenaStarSpan>
            )}
        </ShareButtonSpan>
    );
};

const CautionP = styled.p`
    color: #DA0808;
`;

const colors = [
    { name: 'blue', color: '#02b0f9' },
    { name: 'red', color: '#fe5e65' },
    { name: 'green', color: '#4ce734' },
    { name: 'normal', color: '#fece68' },
];const ArchiveArticle = styled.article<{ showFrame: boolean; }>`
${props => props.showFrame ? `
    margin: 2em 0;
    padding: 1em;
    border-radius: 20px;
    box-shadow: 0 0 10px #CCCCCC;
    @media (prefers-color-scheme: dark) {
        background-color: #111111;
        box-shadow: 0 0 10px #444444;
    }
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

const Archive: React.FC<{
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
        <ShareButtonsDiv>
            <TweetButton
                text={`${props.title} | いうていけろ - hideo54のブログ`}
                url={`https://blog.hideo54.com/archives/${props.filename}`}
            />
            <HatenaBookmarkButton path={`/archives/${props.filename}`} />
            <HatenaStarButton path={`/archives/${props.filename}`} />
        </ShareButtonsDiv>
    );
    return (
        <ArchiveArticle showFrame={showFrame}>
            <section style={{ fontWeight: 'bold' }}>
                <IconNextLink href={'/categories/' + props.category} LeftIcon={Folder}>{props.category}</IconNextLink>
            </section>
            <h2 className='title'>
                <Link href={'/archives/' + props.filename}>
                    <a>
                        {props.title}
                    </a>
                </Link>
            </h2>
            <section>
                <IconSpan LeftIcon={Calendar}>
                    {dayjs(props.date).format('YYYY年M月')}
                </IconSpan>
                {/* <IconNextLink
                    href={{
                        pathname: '/archives',
                        query: {
                            month: dayjs(props.date).format('YYYY-MM'),
                        },
                    }}
                    LeftIcon={Calendar}
                >
                    {dayjs(props.date).format('YYYY年M月')}
                </IconNextLink> */}
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
                <IconNextLink href={'/archives/' + props.filename} RightIcon={ChevronForward}>
                    <a>続きを読む</a>
                </IconNextLink>
            ) : (
                <>
                    <hr color='#0091EA' />
                    <Share />
                </>
            )}
        </ArchiveArticle>
    );
};

export default Archive;

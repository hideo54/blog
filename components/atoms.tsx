import Link from 'next/link';
import styled from 'styled-components';
import type { StyledIcon } from '@styled-icons/styled-icon';
import { Folder, Calendar } from '@styled-icons/ionicons-outline';
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
        <a href={href} target='_blank'>
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
    background: #EEEEEE;
    margin: 4px 0;
    margin-right: 8px;
    padding: 4px 8px;
    border: 2px solid #0091EA;
    border-radius: 4px;
    cursor: pointer;
`;

const ShareButtonSpan = styled.span`
    margin-right: 8px;
`;

const TweetButton: React.FC<{ text: string; url: string; }> = ({ text, url }) => (
    // https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/overview
    <ShareButtonSpan>
        <a className='twitter-share-button' href={'https://twitter.com/intent/tweet?' + qs.stringify({ text, url })}>Tweet</a>
    </ShareButtonSpan>
);

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
        <div>
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
                {props.tags.map(tag =>
                    <Link href={`/tags/${tag}`} key={tag}>
                        <a>
                            <TagSpan>{tag}</TagSpan>
                        </a>
                    </Link>
                )}
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

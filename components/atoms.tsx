import Link from 'next/link';
import styled from 'styled-components';
import type { StyledIcon } from '@styled-icons/styled-icon';
import { Folder } from '@styled-icons/ionicons-outline';
import dayjs, { Dayjs } from 'dayjs';
import { stringifyDate } from '../lib/utils';

export const IconLink: React.FC<{
    LeftIcon?: StyledIcon;
    RightIcon?: StyledIcon;
    href: string;
}> = ({ children, LeftIcon, RightIcon, href }) => {
    const Left = LeftIcon && styled(LeftIcon)`
        vertical-align: text-bottom;
        margin-right: 0.2em;
    `;
    const Right = RightIcon && styled(RightIcon)`
        vertical-align: text-bottom;
        margin-left: 0.2em;
    `;
    if (href.startsWith('/')) {
        return (
            <Link href={href}>
                <a>
                    {LeftIcon && <Left size={'1.2em'} />}
                    {children}
                    {RightIcon && <Right size={'1.2em'} />}
                </a>
            </Link>
        );
    }
    return (
        <a href={href} target='_blank'>
            {LeftIcon && <Left size={'1.2em'} />}
            {children}
            {RightIcon && <Right size={'1.2em'} />}
        </a>
    );
};

const ArchiveArticle = styled.article<{ showFrame: boolean; }>`
    margin: 2em 0;
    ${props => props.showFrame ? `
        padding: 1em;
        border-radius: 20px;
        box-shadow: 0 0 10px #CCCCCC;
    ` : ''}

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
    border-radius: 4px;
`;

export const Archive: React.FC<{
    title: string;
    date: string | Dayjs;
    update: string | Dayjs;
    filename: string;
    category: string;
    tags: string[];
    isExcerpt?: boolean;
    showFrame?: boolean;
}> = ({ children, title, date, update, filename, category, tags, isExcerpt = false, showFrame = false }) => (
    <ArchiveArticle showFrame={showFrame}>
        <IconLink href={'/category/' + category} LeftIcon={Folder}>{category}</IconLink>
        <h2 className='title'>
            <Link href={'/archives/' + filename}>
                <a>
                    {title}
                </a>
            </Link>
        </h2>
        <section>
            <p>{stringifyDate(date)}{update !== date && ` (最終更新: ${stringifyDate(update)})`}</p>
            {dayjs() > dayjs(update).add(6, 'months') && (
                <CautionP>
                    この記事は最終更新から半年以上経過しており、内容が古い可能性があります。
                </CautionP>
            )}
        </section>
        <section>
            {tags.map(tag => <TagSpan key={tag}>{tag}</TagSpan>)}
        </section>
        <section>
            {children}
        </section>
        {isExcerpt && (
            <Link href={'/archives/' + filename}>
                <a>続きを読む</a>
            </Link>
        )}
    </ArchiveArticle>
);

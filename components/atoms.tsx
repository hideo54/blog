import Link from 'next/link';
import styled from 'styled-components';
import type { StyledIcon } from '@styled-icons/styled-icon';
import { Folder } from '@styled-icons/ionicons-outline';

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

const ArchiveArticle = styled.article`
    margin: 1em 0;
    padding: 1em;
    border: solid 1px #CCCCCC;
    border-radius: 20px;
    box-shadow: 0 0 10px #CCCCCC;

    h2 {
        font-feature-settings: 'palt'; // Proportional Alternate Widths. cf. https://helpx.adobe.com/jp/fonts/user-guide.html/jp/fonts/using/open-type-syntax.ug.html#palt
    }

    section {
        margin: 1em 0;
    }
`;

export const Archive: React.FC<{
    title: string;
    filename: string;
    category: string;
    isExcerpt?: boolean;
    }> = ({ children, title, filename, category, isExcerpt = false }) => (
    <ArchiveArticle>
        <IconLink href={'/category/' + category} LeftIcon={Folder}>{category}</IconLink>
        <h2>
            <Link href={'/archives/' + filename}>
                <a>
                    {title}
                </a>
            </Link>
        </h2>
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

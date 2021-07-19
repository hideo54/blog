import Link from 'next/link';
import styled from 'styled-components';

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
        <span>{category}</span>
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

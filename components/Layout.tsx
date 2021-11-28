import { IconAnchor } from '@hideo54/reactor';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { Github } from '@styled-icons/fa-brands';

const LogoTypeDiv = styled.div`
    text-align: center;

    h1 {
        margin-bottom: 0;
        font-size: 3em;
        font-weight: 700;
        text-shadow: 0 0 5px #CCCCCC;
        @media (prefers-color-scheme: dark) {
            text-shadow: 0 0 5px #666666;
        }
    }

    p {
        margin-top: 0;
        font-size: 1.5em;
        font-weight: 200;
    }

    a:hover {
        text-decoration: none;
    }
`;

const NormalHeader = (
    <LogoTypeDiv>
        <h1>
            <Link href='/'>
                <a>
                    いうていけろ
                </a>
            </Link>
        </h1>
        <p>hideo54のブログ</p>
    </LogoTypeDiv>
);

const FooterDiv = styled.footer`
    text-align: center;
    margin: 2em 0;

    div {
        margin: 1em 0;
    }

    hr {
        margin-bottom: 1em;
        border-top: 1px solid #BBBBBB;
        color: transparent;
    }
`;

const NormalFooter = (
    <FooterDiv>
        <hr />
        <div>© hideo54</div>
        <div>
            このブログテーマは
            <IconAnchor href='https://github.com/hideo54/blog' LeftIcon={Github}>
                オープンソースです。
            </IconAnchor>
        </div>
    </FooterDiv>
);

const Layout: React.FC<{
    title?: string;
    description?: string;
    imageUrl?: string;
    twitterCardType?: 'summary' | 'summary_large_image' | 'app' | 'player';
    header?: JSX.Element;
    footer?: JSX.Element;
}> = ({
    children,
    title = 'いうていけろ | hideo54のブログ',
    description = 'hideo54のブログ',
    imageUrl = 'https://img.hideo54.com/icons/main.png',
    twitterCardType = 'summary',
    header = NormalHeader,
    footer = NormalFooter,
}) => (
    <>
        <Head>
            <meta charSet='utf-8' />
            <meta name='viewport' content='initial-scale=1.0, width=device-width' />
            <meta name='description' content={description} />
            <meta key='og:site_name' property='og:site_name' content='hideo54 Lab' />
            <meta key='og:title' property='og:title' content={title} />
            <meta key='og:description' property='og:description' content={description} />
            {imageUrl &&
                <meta property='og:image' content={imageUrl} />
            }
            <meta key='twitter:card' name='twitter:card' content={twitterCardType} />
            <meta key='twitter:site' name='twitter:site' content='@hideo54' />
            <title>{title}</title>
            <link rel='icon' type='image/png' href='https://img.hideo54.com/icons/main.png' />
            <link rel='apple-touch-icon' href='https://img.hideo54.com/icons/main.png' />
        </Head>
        {header && <header>{header}</header>}
        <main>
            {children}
        </main>
        {footer && <footer>{footer}</footer>}
    </>
);

export default Layout;

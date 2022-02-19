import React, { useState, useRef, useEffect } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import styled from 'styled-components';
import { Open } from '@styled-icons/ionicons-outline';
import { Twitter } from '@styled-icons/fa-brands';
import { IconAnchor, IconNextLink } from '@hideo54/reactor';
import Footnote from './Footnote';

const H2 = styled.h2`
    &::before {
        content: '#';
        color: ${props => props.theme.color.accent};
        margin-right: 0.5em;
    }
`;

const H3 = styled.h3`
    &::before {
        content: '##';
        color: ${props => props.theme.color.accent};
        margin-right: 0.5em;
    }
`;

const H4 = styled.h4`
    /* text-decoration: underline ${props => props.theme.color.accent} 2px; // Safari does not support this style. FUCK. Instead: */
    text-decoration: underline;
    text-decoration-color: ${props => props.theme.color.accent};
    text-decoration-thickness: 2px;
`;

const InlineCode = styled.code`
    margin: 2px;
    padding: 2px 4px;
    line-height: 2em;
    border-radius: 4px;
    background-color: ${props => props.theme.color.shadow};
`;

const Pre = styled.pre`
    padding: 8px;
    border-radius: 8px;
    overflow: auto;
    background-color: ${props => props.theme.color.boxBackground};
`;

const Hr = styled.hr`
    border: none; // For Chrome and Safari
    border-top: 1px dashed #BBBBBB;
    color: transparent;
`;

const Img = styled.img`
    display: block;
    margin: 0 auto;
    max-width: 100%;
`;

const Blockquote = styled.blockquote`
    border-left: 4px solid ${props => props.theme.color.text};
    padding-left: 1em;

    p {
        color: ${props => props.theme.color.text};
    }
`;

const Table = styled.table`
    border-collapse: collapse;
    margin: 0 auto;
    text-align: center;
    thead {
        border-bottom: 2px solid ${props => props.theme.color.accent};
    }
    th, td {
        padding: 0.5em;
    }
`;

const TweetDiv = styled.div`
    div.twitter-tweet-rendered {
        margin: 1em auto;
    }
`;

const Tweet: React.FC<{ url: string; }> = ({ url }) => {
    const containerElement = useRef<HTMLDivElement>(null);
    const screenName = url.split('/').splice(-3)[0];
    const tweetId = url.split('/').splice(-1)[0];
    const dark = false;
    const [twttrSupported, setTwttrSupported] = useState(false);
    useEffect(() => {
        // @ts-expect-error twttr
        if (!twttr.widgets) return;
        if (!containerElement.current) return;
        setTwttrSupported(true);
        // @ts-expect-error twttr
        twttr.widgets.createTweet(tweetId, containerElement.current, {
            theme: dark ? 'dark' : 'light',
            lang: 'ja',
        });
        // https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-javascript-factory-function
    }, [containerElement, tweetId, dark]);
    return (
        <TweetDiv ref={containerElement}>
            {twttrSupported || (
                <div style={{ textAlign: 'center' }}>
                    <IconAnchor LeftIcon={Twitter} RightIcon={Open} href={url}>
                        @{screenName}のツイート
                    </IconAnchor>
                </div>
            )}
        </TweetDiv>
    );
};

const components = {
    h1: (props: React.ComponentPropsWithoutRef<'h1'>) => <H2 {...props} />, // h1 も h2 にする
    h2: (props: React.ComponentPropsWithoutRef<'h2'>) => <H2 {...props} />,
    h3: (props: React.ComponentPropsWithoutRef<'h3'>) => <H3 {...props} />,
    h4: (props: React.ComponentPropsWithoutRef<'h4'>) => <H4 {...props} />,
    blockquote: (props: React.ComponentPropsWithoutRef<'blockquote'>) => <Blockquote {...props} />,
    code: (props: React.ComponentPropsWithoutRef<'code'>) =>
        props.children?.toString().includes('\n')
            ? <Pre {...props} />
            : <InlineCode {...props} />,
    pre: (props: React.ComponentPropsWithoutRef<'pre'>) => <Pre {...props} />,
    hr: () => <Hr />,
    a: (props: React.ComponentPropsWithoutRef<'a'>) =>
        (props.href && props.href.startsWith('/'))
            ? <IconNextLink {...{ ...props, href: props.href } }/>
            : <IconAnchor RightIcon={Open} {...props} />,
    img: (props: React.ComponentPropsWithoutRef<'img'>) => <Img {...props} />,
    table: (props: React.ComponentPropsWithoutRef<'table'>) => <Table {...props} />,
    // https://mdxjs.com/table-of-components
    Tweet: (props: { url: string; }) => <Tweet {...props} />,
    Footnote: (props: { short: string; }) => <Footnote {...props} />,
};

const MDXProvider: React.FC<{ mdxSource: MDXRemoteSerializeResult; }> = ({ mdxSource }) => (
    <MDXRemote {...mdxSource} components={components} />
);

export default MDXProvider;

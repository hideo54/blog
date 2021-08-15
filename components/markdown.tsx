/* eslint-disable react/display-name */
import { useState, useRef, useEffect } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import styled from 'styled-components';
import { Open } from '@styled-icons/ionicons-outline';
import { Twitter } from '@styled-icons/fa-brands';
import { IconLink } from './atoms';

const H2 = styled.h2`
    border-left: 4px solid #0091EA;
    margin-top: 1.5em;
    padding-left: 8px;
`;

const Code = styled.code`
    background: #EEEEEE;
    margin: 2px;
    padding: 2px 4px;
    line-height: 2em;
    border-radius: 4px;
`;

const Pre = styled.pre`
    background: #EEEEEE;
    padding: 8px;
    border-radius: 8px;
    overflow: auto;
`;

const Hr = styled.hr`
    border-top: 1px dashed #BBBBBB;
    color: transparent;
`;

const Img = styled.img`
    display: block;
    margin: 0 auto;
    max-width: 100%;
`;

const Blockquote = styled.blockquote`
    border-left: 4px solid #CCCCCC;
    padding-left: 1em;

    p {
        color: #888888;
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
        setTwttrSupported(true);
        // @ts-expect-error twttr
        twttr.widgets.createTweet(tweetId, containerElement.current, {
            theme: dark ? 'dark' : 'light',
            lang: 'ja',
        });
        // https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-javascript-factory-function
    }, [tweetId, dark]);
    return (
        <TweetDiv ref={containerElement}>
            {twttrSupported || (
                <div style={{ textAlign: 'center' }}>
                    <IconLink LeftIcon={Twitter} RightIcon={Open} href={url}>
                        @{screenName}のツイート
                    </IconLink>
                </div>
            )}
        </TweetDiv>
    );
};

const components = {
    h1: props => <H2 {...props} />, // h1 も h2 にする
    h2: props => <H2 {...props} />,
    blockquote: props => <Blockquote {...props} />,
    inlineCode: props => <Code {...props} />,
    pre: props => <Pre {...props} />,
    hr: () => <Hr />,
    a: props => <IconLink RightIcon={Open} {...props} />,
    img: props => <Img {...props} />,
    // https://mdxjs.com/table-of-components
    Tweet: props => <Tweet {...props} />,
};

export const MDXProvider: React.FC<{ mdxSource: MDXRemoteSerializeResult; }> = ({ mdxSource }) => (
    <MDXRemote {...mdxSource} components={components} />
);

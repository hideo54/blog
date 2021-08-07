import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import styled from 'styled-components';
import { Open } from '@styled-icons/ionicons-outline';
import { useRef, useEffect } from 'react';
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
`;

const Img = styled.img`
    display: block;
    margin: 0 auto;
    max-width: 100%;
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
    useEffect(() => {
        // @ts-ignore
        twttr.widgets.createTweet(tweetId, containerElement.current, dark && { theme: 'dark' });
        // https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-javascript-factory-function
    }, []);
    return (
        <TweetDiv ref={containerElement}>
            {/* <IconLink RightIcon={Open} href={url}>@{screenName}のツイート</IconLink> */}
        </TweetDiv>
    );
};

const components = {
    a: props => <IconLink RightIcon={Open} href={props.href}>{props.children}</IconLink>,
    h1: props => <H2>{props.children}</H2>, // h1 も h2 にする
    h2: props => <H2>{props.children}</H2>,
    inlineCode: props => <Code>{props.children}</Code>,
    pre: props => <Pre>{props.children}</Pre>,
    hr: () => <Hr />,
    img: props => <Img {...props} />,
    Tweet: props => <Tweet {...props} />
};

export const MDXProvider: React.FC<{ mdxSource: MDXRemoteSerializeResult; }> = ({ mdxSource }) => (
    <MDXRemote {...mdxSource} components={components} />
);

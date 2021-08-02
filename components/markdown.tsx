import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import styled from 'styled-components';
import { Open } from '@styled-icons/ionicons-outline';
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

const components = {
    a: props => <IconLink RightIcon={Open} href={props.href}>{props.children}</IconLink>,
    h2: props => <H2>{props.children}</H2>,
    inlineCode: props => <Code>{props.children}</Code>,
    pre: props => <Pre>{props.children}</Pre>,
};

export const MDXProvider: React.FC<{ mdxSource: MDXRemoteSerializeResult; }> = ({ mdxSource }) => (
    <MDXRemote {...mdxSource} components={components} />
);

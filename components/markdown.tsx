import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import { Open } from '@styled-icons/ionicons-outline';
import { IconLink } from './atoms';

const components = {
    a: props => <IconLink RightIcon={Open} href={props.href}>{props.children}</IconLink>,
};

export const MDXProvider: React.FC<{ mdxSource: MDXRemoteSerializeResult; }> = ({ mdxSource }) => (
    <MDXRemote {...mdxSource} components={components} />
);

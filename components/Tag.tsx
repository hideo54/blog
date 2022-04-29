import type { ReactNode } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const TagSpan = styled.span`
    display: inline-block;
    position: relative;
    margin: 4px 12px;
    padding: 4px 8px;
    border: 2px solid ${props => props.theme.color.accent};
    border-left: none;
    border-radius: 4px;
    cursor: pointer;
    color: ${props => props.theme.color.accent};
    &::before {
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        width: 1em;
        height: 1em;
        transform: translateX(-6px) translateY(3px) rotate(45deg) scale(1.2);
        border-left: 2px solid ${props => props.theme.color.accent};
        border-bottom: 2px solid ${props => props.theme.color.accent};
        border-radius: 4px;
    }
`;

const Tag: React.FC<{
    children: ReactNode;
}> = ({ children }) => (
    <Link href={`/tags/${children}`}>
        <a>
            <TagSpan>{children}</TagSpan>
        </a>
    </Link>
);

export default Tag;

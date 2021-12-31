import Link from 'next/link';
import styled from 'styled-components';

const TagSpan = styled.span`
    display: inline-block;
    position: relative;
    margin: 4px 12px;
    padding: 4px 8px;
    border: 2px solid #0091EA;
    border-left: none;
    border-radius: 4px;
    cursor: pointer;
    color: #0091EA;
    &::before {
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        width: 1em;
        height: 1em;
        transform: translateX(-6px) translateY(3px) rotate(45deg) scale(1.2);
        border-left: 2px solid #0091EA;
        border-bottom: 2px solid #0091EA;
        border-radius: 4px;
    }
`;

const Tag: React.FC = ({ children }) => (
    <Link href={`/tags/${children}`}>
        <a>
            <TagSpan>{children}</TagSpan>
        </a>
    </Link>
);

export default Tag;

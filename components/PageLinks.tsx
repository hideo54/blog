import type { ReactNode } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const PageLinksDiv = styled.div`
    display: flex;
    justify-content: center;
    div {
        width: 40px;
        height: 40px;
        margin: 0.5em;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.2em;
        &.abbr {
            cursor: default;
        }
        &:not(.abbr) {
            &.current {
                border: 2px solid ${props => props.theme.color.accent};
                color: white;
                background-color: ${props => props.theme.color.accent};
                cursor: default;
            }
            &:not(.current) {
                border: 2px solid ${props => props.theme.color.accent};
                color: ${props => props.theme.color.accent};
                cursor: pointer;
                &:hover {
                    background-color: #eeeeee;
                }
            }
        }
    }
    a {
        text-decoration: none;
    }
`;

const PageLink: React.FC<{
    children?: ReactNode;
    path: string;
    abbr?: boolean;
    current?: boolean;
}> = ({ children, path, abbr = false, current = false }) => (
    abbr ? (
        <div className='abbr'>…</div>
    ) : (
        <Link href={children === '1' ? path : `${path}?p=${children}`}>
            <a>
                <div className={current ? 'current' : ''}>{children}</div>
            </a>
        </Link>
    )
);

const PageLinks: React.FC<{
    path: string;
    current: number;
    max: number;
}> = ({ path, current, max }) => {
    return (
        <PageLinksDiv>
            <PageLink path={path} current={current === 1}>1</PageLink>
            {current > 3 && <PageLink path={path} abbr />}
            {current > 2 && <PageLink path={path}>{current - 1}</PageLink>}
            {current > 1 && <PageLink path={path} current>{current}</PageLink>}
            {current < max && <PageLink path={path}>{current + 1}</PageLink>}
            {current < max - 1 && <PageLink path={path} abbr />}
        </PageLinksDiv>
    );
};

export default PageLinks;

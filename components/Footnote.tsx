import { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const FootnoteSpan = styled.span`
    & > sup {
        color: ${props => props.theme.color.accent};
        cursor: pointer;
    }
    & > div {
        position: absolute;
        min-width: 200px;
        min-height: 100px;
        max-width: min(90vw, 400px);
        margin: 0 1em;
        border-radius: 16px;
        opacity: 0.95;
        padding: 1em;
        border: 1px solid ${props => props.theme.color.shadow};
        background-color: ${props => props.theme.color.background};
    }
`;

const Footnote: React.FC<{
    short: string;
    children?: ReactNode;
}> = ({ children, short }) => {
    const [showPopup, setShowPopup] = useState(false);
    const spanRef = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        if (!spanRef.current) return;
        spanRef.current.addEventListener('mouseover', () => {
            setShowPopup(true);
        });
        spanRef.current.addEventListener('mouseleave', () => {
            setShowPopup(false);
        });
    }, [spanRef]);
    return (
        <FootnoteSpan ref={spanRef}>
            <sup
                onClick={() => { setShowPopup(!showPopup); }}
            >
                {short}
            </sup>
            {showPopup && <div>{children}</div>}
        </FootnoteSpan>
    );
};

export default Footnote;

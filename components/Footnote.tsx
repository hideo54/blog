import styled from 'styled-components';
import Popup from 'reactjs-popup';

const Sup = styled.sup`
    cursor: pointer;
    color: #0091EA;
`;

const Div = styled.div`
    min-width: 200px;
    min-height: 100px;
    max-width: min(90vw, 400px);
    margin: 0 1em;
    border-radius: 16px;
    opacity: 0.95;
    padding: 1em;
    border: 1px solid #333333;
    background-color: white;
    @media (prefers-color-scheme: dark) {
        border: 1px solid #CCCCCC;
        background-color: #111111;
    }
`;

const Footnote: React.FC<{ short: string;}> = ({ children, short }) => (
    <Popup position='bottom center' offsetX={8} trigger={<Sup>{short}</Sup>}>
        {() => <Div>{children}</Div>}
    </Popup>
);

export default Footnote;

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import * as gtag from '../lib/gtag';

interface Theme {
    color: {
        text: string;
        accent: string;
        background: string;
        boxBackground: string;
        shadow: string;
    };
}

const lightColorTheme: Theme['color'] = {
    text: '#333333',
    accent: '#0091ea',
    background: '#ffffff',
    boxBackground: '#ffffff',
    shadow: '#cccccc',
};

const darkColorTheme: Theme['color'] = {
    text: '#cccccc',
    accent: '#0091ea',
    background: '#000000',
    boxBackground: '#131313',
    shadow: '#444444',
};

const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
    body {
        -webkit-text-size-adjust: 100%;
        background-color: ${props => props.theme.color.background};
    }

    body, select, button {
        font-family: -apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Noto Sans JP', sans-serif;
        margin: 0;
    }

    header, main, footer {
        display: block; /* for IE */
    }

    main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1em;
    }

    footer {
        margin-top: 3em;
        margin-bottom: 1em;
        padding: 0 1em;
    }

    h1, h2, h3, h4, h5, h6, p, div, span {
        :not(a &) {
            color: ${props => props.theme.color.text};
        }
    }

    p {
        line-height: 1.6;
    }

    strong {
        font-weight: 800;
    }

    span {
        line-height: 100%;
    }

    a {
        color: ${props => props.theme.color.accent};
        text-decoration: none;
        overflow-wrap: anywhere;
        &:hover {
            text-decoration: underline;
        }
    }

    li {
        margin: 0.5em 0;
        line-height: 1.6;
    }

    section {
        margin: 1em 0;
    }
`;

const App = ({ Component, pageProps }: AppProps) => {
    const router = useRouter();
    useEffect(() => {
        const handleRouteChange = (url: string) => {
            gtag.pageview(url);
        };
        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);
    // https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/pages/_app.js
    const [colorName, setColorName] = useState<'light' | 'dark'>('light');
    useEffect(() => {
        if (matchMedia('(prefers-color-scheme: dark)').matches) {
            setColorName('dark');
        } else {
            setColorName('light');
        }
    }, []);
    if (process.browser) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (matchMedia('(prefers-color-scheme: dark)').matches) {
                setColorName('dark');
            } else {
                setColorName('light');
            }
        });
    }
    return (
        <ThemeProvider theme={{
            color: colorName === 'light' ? lightColorTheme : darkColorTheme,
        }}>
            <Component {...pageProps} />
            <GlobalStyle />
        </ThemeProvider>
    );
};

export default App;

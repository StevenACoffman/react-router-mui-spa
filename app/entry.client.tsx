import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {HydratedRouter} from 'react-router/dom';
import {CacheProvider} from '@emotion/react';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ClientStyleContext from './lib/mui/ClientStyleContext';
import createEmotionCache from './lib/mui/createEmotionCache';
import theme from '~/lib/mui/theme.js';

interface ClientCacheProviderProps {
    children: React.ReactNode;
}
function ClientCacheProvider({ children }: ClientCacheProviderProps) {
    const [cache, setCache] = React.useState(createEmotionCache());

    const clientStyleContextValue = React.useMemo(
        () => ({
            reset() {
                setCache(createEmotionCache());
            },
        }),
        [],
    );

    return (
        <ClientStyleContext.Provider value={clientStyleContextValue}>
            <CacheProvider value={cache}>{children}</CacheProvider>
        </ClientStyleContext.Provider>
    );
}

const hydrate = () => {
    React.startTransition(() => {
        ReactDOM.hydrateRoot(
            document,
            <ClientCacheProvider>
                <ThemeProvider theme={theme}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />
                    <HydratedRouter />
                </ThemeProvider>
            </ClientCacheProvider>,
        );
    });
};

if (window.requestIdleCallback) {
    window.requestIdleCallback(hydrate);
} else {
    // Safari doesn't support requestIdleCallback
    // https://caniuse.com/requestidlecallback
    setTimeout(hydrate, 1);
}
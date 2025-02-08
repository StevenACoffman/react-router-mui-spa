import type {AppLoadContext, EntryContext} from "react-router";
import {ServerRouter} from "react-router";
import ReactDOMServer from "react-dom/server";
import createEmotionCache from "./lib/mui/createEmotionCache";
import createEmotionServer from "@emotion/server/create-instance";
import {CacheProvider} from "@emotion/react";
import {CssBaseline, ThemeProvider} from '@mui/material';
import theme from '~/lib/mui/theme.js';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  loadContext: AppLoadContext
) {
    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    function MuiServer() {
        return (
            <CacheProvider value={cache}>
                <ThemeProvider theme={theme}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />
                    <ServerRouter context={routerContext} url={request.url} />
                </ThemeProvider>
            </CacheProvider>
        );
    }

    // Render the component to a string.
    const html = ReactDOMServer.renderToString(<MuiServer />);

    // Grab the CSS from emotion
    const { styles } = extractCriticalToChunks(html);

    let stylesHTML = '';

    styles.forEach(({ key, ids, css }) => {
        const emotionKey = `${key} ${ids.join(' ')}`;
        const newStyleTag = `<style data-emotion="${emotionKey}">${css}</style>`;
        stylesHTML = `${stylesHTML}${newStyleTag}`;
    });

    // Add the Emotion style tags after the insertion point meta tag
    const markup = html.replace(
        /<meta(\s)*name="emotion-insertion-point"(\s)*content="emotion-insertion-point"(\s)*\/>/,
        `<meta name="emotion-insertion-point" content="emotion-insertion-point"/>${stylesHTML}`,
    );

    responseHeaders.set('Content-Type', 'text/html');

    return new Response(`<!DOCTYPE html>${markup}`, {
        status: responseStatusCode,
        headers: responseHeaders,
    });
}

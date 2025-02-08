# React Router with Material UI

This is a reproduction of a failure to produce a SPA with React Router v7 and Material UI. 

1. I started with a new React Router v7 app with `npx create-vite@latest`.
2. I added MUI parts from the [official example](https://github.com/mui/material-ui/tree/v6.x/examples/material-ui-remix-ts).

Once I run `npm run build`, I get the following failure:

```
[react-router] Directory import '@mui/utils/formatMuiErrorMessage' is not supported resolving ES modules imported from @mui/material/styles/index.js
Did you mean to import "@mui/utils/formatMuiErrorMessage/index.js"?

ERR_UNSUPPORTED_DIR_IMPORT
```

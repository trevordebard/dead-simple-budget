import { ApolloProvider } from '@apollo/client';
import { createGlobalStyle } from 'styled-components';
import { Provider } from 'next-auth/client';
import { useApollo } from '../lib/apolloClient';
import Head from '../components/head';

const GlobalStyle = createGlobalStyle`
  :root {
    --purp: hsl(282, 44%, 47%);
    --purp-o25: hsl(282, 44%, 47%, 25%);
    --purpLight: hsl(282, 44%, 53%);
    --red: hsl(1, 57%, 43%);
    --red-o25: hsl(1, 57%, 43%, 25%);
    --redLight: hsl(1, 57%, 49%);
    --aqua: hsl(186, 61%, 45%);
    --aqua-o25: hsl(186, 61%, 45%, 15%);
    --aquaLight: hsl(186, 61%, 51%);
    --yellow: #FAEA7A;
    --green: hsl(152, 55%,44%);
    --lightGreen: hsl(152, 55%, 50%);
    --green-h1: hsl(152, 55%, 44%, 10%);
    --green-h2: hsl(152, 55%, 40%, 10%);
    --black:  hsl(211, 39%, 23%);
    --black-o10:  hsl(211, 39%, 23%, 10%);

    --lineColor: #EAEAEA;
    --backgroundSubtle: hsl(211, 39%, 23%, 3%);
    
    --fontColor: var(--black);
    --fontColor-o60: hsl(211, 39%, 23%, 60%);
    --baseFontSize: 100%;
    --smallFontSize: .8em;
    
    --primary: var(--purp);
    --primaryLight: var(--purpLight);
    --primaryHover: var(--purp-o25);
    --action: var(--aqua);
    --actionLight: var(--aquaLight);
    --actionHover: var(--aqua-o25);
    --danger: var(--red);
    --dangerLight: var(--redLight);
    --dangerHover: var(--red-o25);
    --neutral: var(--fontColor);
    --neutralHover: var(--black-o10);
    --rowHover: var(--green-h2);
    --rowHoverDark: var(--green-h1);

    /* Elevation */
    --level1: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    --level2: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --level3: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  html,body {
    box-sizing: border-box;
    max-width: 100%;
    height: 100%;
    overflow-x: hidden;
    font-size: var(--baseFontSize)
  }
  body {
    margin: 0;
    padding: 5px;
    color: var(--fontColor);
    background-color: white;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    line-height: 1.65;
    color: #333;
  }

/* p {margin-bottom: 1.15rem;} */

  h1, h2, h3, h4, h5 {
    font-family: 'Raleway', sans-serif;
    font-weight: 400;
    line-height: 1.15;
    margin: 1rem .5rem;
  }

  h1 {
    font-size: 3.052em;
  }

  h2 {font-size: 2.441em;}

  h3 {font-size: 1.953em;}

  h4 {font-size: 1.563em;}

  h5 {font-size: 1.25em;}

  body,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  ul,
  ol,
  li,
  p,
  pre,
  blockquote,
  figure,
  hr {
    margin: 0;
    padding: 0;
  }
  ul {
    list-style: none;
  }
  input,
  textarea,
  select,
  button {
    color: inherit; 
    font: inherit; 
    letter-spacing: inherit;
  }
`;

function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <>
      <GlobalStyle />
      <Head />
      <Provider session={pageProps.session}>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Provider>
    </>
  );
}

export default MyApp;

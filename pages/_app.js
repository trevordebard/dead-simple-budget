import { ApolloProvider } from '@apollo/client';
import { createGlobalStyle } from 'styled-components';
import { withApollo } from '../lib/withApollo';
import Head from '../components/head';

const GlobalStyle = createGlobalStyle`
  :root {
    font-size: 10px;
    --purp: hsl(282, 44%, 47%);
    --purp-15: hsl(282, 44%, 47%, 15%);
    --aqua: #2DADBA;
    --yellow: #FAEA7A;
    --green: hsl(152, 55%,44%);
    --green10: hsl(152, 55%,44%, 10%);
    --lineColor: #EAEAEA;
    --fontColor: hsl(211, 39%, 23%);
    --fontColor60: hsl(211, 39%, 23%, 60%);
    --backgroundSubtle: hsl(211, 39%, 23%, 3%); 
    --primary: var(--purp);
    --action: var(--aqua);
    --neutral: var(--fontColor);
  }
  * {
    box-sizing: border-box;
  }
  html,body {
    max-width: 100%;
    height: 100%;
    overflow-x: hidden;
  }
  body {
    margin: 0;
    padding: 5px;
    color: var(--fontColor);
  }
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
    font-family: 'Roboto', sans-serif;
    font-size: 1.6rem;
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
  input,
  textarea,
  button {
    border: 1px solid gray; 
  }
`;

function MyApp({ Component, pageProps, apollo }) {
  return (
    <>
      <GlobalStyle />
      <Head />
      <ApolloProvider client={apollo}>
        <Component {...pageProps} />>
      </ApolloProvider>
    </>
  );
}

export default withApollo(MyApp);
